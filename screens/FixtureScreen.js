import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from 'date-fns';

const FixtureScreen = ({ navigation }) => {
  const [fixtures, setFixtures] = useState([]);
  const [filteredFixtures, setFilteredFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        // Try to load cached data first
        const cachedData = await AsyncStorage.getItem("fixturesData");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setFixtures(parsedData);
          filterFixturesByWeek(parsedData, currentWeek);
          setLoading(false);
        }

        // Fetch fresh data from API
        const response = await axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures", {
          params: {
            league: '39',
            season: '2024'
          },
          headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': '509b2a95a9msh3feffa16b6bb594p184467jsn74ea44f78c89'
          }
        });

        const processedFixtures = response.data.response.map(fixture => ({
          id: fixture.fixture.id,
          date: fixture.fixture.date,
          homeTeam: {
            name: fixture.teams.home.name,
            logo: fixture.teams.home.logo,
            score: fixture.goals.home
          },
          awayTeam: {
            name: fixture.teams.away.name,
            logo: fixture.teams.away.logo,
            score: fixture.goals.away
          },
          venue: fixture.fixture.venue.name,
          status: fixture.fixture.status.long
        }));

        setFixtures(processedFixtures);
        filterFixturesByWeek(processedFixtures, currentWeek);
        setLoading(false);

        // Cache the processed data
        await AsyncStorage.setItem("fixturesData", JSON.stringify(processedFixtures));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  useEffect(() => {
    filterFixturesByWeek(fixtures, currentWeek);
  }, [currentWeek]);

  const filterFixturesByWeek = (allFixtures, selectedDate) => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const filtered = allFixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.date);
      return isWithinInterval(fixtureDate, { start: weekStart, end: weekEnd });
    });

    setFilteredFixtures(filtered);
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(current => 
      direction === 'next' ? addWeeks(current, 1) : subWeeks(current, 1)
    );
  };

  const WeekSelector = () => (
    <View style={styles.weekSelectorContainer}>
      <TouchableOpacity 
        style={styles.weekButton} 
        onPress={() => navigateWeek('prev')}
      >
        <Text style={styles.weekButtonText}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.weekInfo}>
        <Text style={styles.weekText}>
          {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - {' '}
          {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.weekButton} 
        onPress={() => navigateWeek('next')}
      >
        <Text style={styles.weekButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );

  const handleFixturePress = (fixture) => {
    navigation.navigate("FixtureDetail", { fixtureId: fixture.id });
  };

  const renderFixture = ({ item }) => {
    const fixtureDate = new Date(item.date);
    const formattedDate = format(fixtureDate, 'MMM dd, yyyy');
    const formattedTime = format(fixtureDate, 'HH:mm');

    return (
      <TouchableOpacity 
        style={styles.fixtureCard} 
        onPress={() => handleFixturePress(item)}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>
        
        <View style={styles.matchContainer}>
          <View style={styles.teamContainer}>
            <Image 
              source={{ uri: item.homeTeam.logo }} 
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{item.homeTeam.name}</Text>
            <Text style={styles.score}>
              {item.status === "Match Finished" ? item.homeTeam.score : "-"}
            </Text>
          </View>

          <Text style={styles.vs}>vs</Text>

          <View style={styles.teamContainer}>
            <Image 
              source={{ uri: item.awayTeam.logo }} 
              style={styles.teamLogo}
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{item.awayTeam.name}</Text>
            <Text style={styles.score}>
              {item.status === "Match Finished" ? item.awayTeam.score : "-"}
            </Text>
          </View>
        </View>

        <View style={styles.venueContainer}>
          <Text style={styles.venueText}>{item.venue}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WeekSelector />
      {filteredFixtures.length === 0 ? (
        <View style={styles.noFixturesContainer}>
          <Text style={styles.noFixturesText}>No fixtures this week</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFixtures}
          renderItem={renderFixture}
          keyExtractor={(item) => item.id.toString()}
          style={styles.fixturesList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  weekSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: 44,
    alignItems: 'center',
  },
  weekButtonText: {
    fontSize: 18,
    color: '#2c3e50',
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  noFixturesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFixturesText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  fixturesList: {
    flex: 1,
  },
  fixtureCard: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
  },
  timeText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 2,
  },
  matchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 4,
  },
  vs: {
    fontSize: 14,
    color: "#95a5a6",
    marginHorizontal: 10,
  },
  venueContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    marginTop: 8,
  },
  venueText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  statusText: {
    fontSize: 12,
    color: "#27ae60",
    marginTop: 2,
  },
});

export default FixtureScreen;