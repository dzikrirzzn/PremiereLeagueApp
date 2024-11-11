import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FixtureDetail = ({ route }) => {
  const { fixtureId } = route.params;
  const [loading, setLoading] = useState(true);
  const [homeStats, setHomeStats] = useState(null);
  const [awayStats, setAwayStats] = useState(null);
  const [fixtureDetails, setFixtureDetails] = useState(null);
  const [homeLineup, setHomeLineup] = useState(null);
  const [awayLineup, setAwayLineup] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' or 'lineups'

  useEffect(() => {
    const fetchFixtureDetails = async () => {
      try {
        // First fetch basic fixture details from cache
        const cachedData = await AsyncStorage.getItem("fixturesData");
        if (cachedData) {
          const allFixtures = JSON.parse(cachedData);
          const currentFixture = allFixtures.find(f => f.id === fixtureId);
          setFixtureDetails(currentFixture);
        }

        // Fetch home team stats
        const homeResponse = await axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics", {
          params: {
            fixture: fixtureId,
            team: fixtureDetails?.homeTeam?.id
          },
          headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': '509b2a95a9msh3feffa16b6bb594p184467jsn74ea44f78c89'
          }
        });

        // Fetch away team stats
        const awayResponse = await axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics", {
          params: {
            fixture: fixtureId,
            team: fixtureDetails?.awayTeam?.id
          },
          headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': '509b2a95a9msh3feffa16b6bb594p184467jsn74ea44f78c89'
          }
        });

        // Fetch lineups
        const lineupsResponse = await axios.get("https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups", {
          params: {
            fixture: fixtureId
          },
          headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': '509b2a95a9msh3feffa16b6bb594p184467jsn74ea44f78c89'
          }
        });

        if (homeResponse.data.response[0]) {
          setHomeStats(homeResponse.data.response[0].statistics);
        }
        if (awayResponse.data.response[0]) {
          setAwayStats(awayResponse.data.response[0].statistics);
        }
        if (lineupsResponse.data.response) {
          const lineups = lineupsResponse.data.response;
          setHomeLineup(lineups[0]);
          setAwayLineup(lineups[1]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fixture details:", error);
        setLoading(false);
      }
    };

    fetchFixtureDetails();
  }, [fixtureId]);

  const renderStatItem = (statName, homeValue, awayValue) => {
    const homeValueNum = parseFloat(homeValue) || 0;
    const awayValueNum = parseFloat(awayValue) || 0;
    const total = homeValueNum + awayValueNum;
    const homePercent = total > 0 ? (homeValueNum / total) * 100 : 50;
    
    return (
      <View style={styles.statItem} key={statName}>
        <View style={styles.statValues}>
          <Text style={styles.statValue}>{homeValue || '0'}</Text>
          <Text style={styles.statName}>{statName}</Text>
          <Text style={styles.statValue}>{awayValue || '0'}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, styles.homeBar, { width: `${homePercent}%` }]} />
          <View style={[styles.progressBar, styles.awayBar, { width: `${100 - homePercent}%` }]} />
        </View>
      </View>
    );
  };

  const renderLineups = () => {
    if (!homeLineup || !awayLineup) {
      return <Text style={styles.noDataText}>Lineup data not available</Text>;
    }

    return (
      <View style={styles.lineupsContainer}>
        {/* Formation */}
        <View style={styles.formationContainer}>
          <Text style={styles.formationText}>
            {homeLineup.formation} vs {awayLineup.formation}
          </Text>
        </View>

        {/* Coaches */}
        <View style={styles.coachesContainer}>
          <View style={styles.coachInfo}>
            <Image
              source={{ uri: homeLineup.coach.photo }}
              style={styles.coachPhoto}
            />
            <Text style={styles.coachName}>{homeLineup.coach.name}</Text>
          </View>
          <Text style={styles.coachDivider}>Coaches</Text>
          <View style={styles.coachInfo}>
            <Image
              source={{ uri: awayLineup.coach.photo }}
              style={styles.coachPhoto}
            />
            <Text style={styles.coachName}>{awayLineup.coach.name}</Text>
          </View>
        </View>

        {/* Starting XI */}
        <View style={styles.lineupSection}>
          <Text style={styles.lineupSectionTitle}>Starting XI</Text>
          <View style={styles.playersContainer}>
            <View style={styles.teamPlayers}>
              {homeLineup.startXI.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>{player.player.pos}</Text>
                </View>
              ))}
            </View>
            <View style={styles.teamPlayers}>
              {awayLineup.startXI.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>{player.player.pos}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Substitutes */}
        <View style={styles.lineupSection}>
          <Text style={styles.lineupSectionTitle}>Substitutes</Text>
          <View style={styles.playersContainer}>
            <View style={styles.teamPlayers}>
              {homeLineup.substitutes.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>{player.player.pos}</Text>
                </View>
              ))}
            </View>
            <View style={styles.teamPlayers}>
              {awayLineup.substitutes.map((player, index) => (
                <View key={index} style={styles.playerItem}>
                  <Text style={styles.playerNumber}>{player.player.number}</Text>
                  <Text style={styles.playerName}>{player.player.name}</Text>
                  <Text style={styles.playerPosition}>{player.player.pos}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
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
    <ScrollView style={styles.container}>
      {/* Match Header */}
      <View style={styles.matchHeader}>
        <View style={styles.teamInfo}>
          <Image
            source={{ uri: fixtureDetails?.homeTeam?.logo }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
          <Text style={styles.teamName}>{fixtureDetails?.homeTeam?.name}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {fixtureDetails?.homeTeam?.score || 0} - {fixtureDetails?.awayTeam?.score || 0}
          </Text>
          <Text style={styles.status}>{fixtureDetails?.status}</Text>
        </View>
        
        <View style={styles.teamInfo}>
          <Image
            source={{ uri: fixtureDetails?.awayTeam?.logo }}
            style={styles.teamLogo}
            resizeMode="contain"
          />
          <Text style={styles.teamName}>{fixtureDetails?.awayTeam?.name}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lineups' && styles.activeTab]}
          onPress={() => setActiveTab('lineups')}
        >
          <Text style={[styles.tabText, activeTab === 'lineups' && styles.activeTabText]}>
            Lineups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'stats' ? (
        <View style={styles.statsContainer}>
          <Text style={styles.statsHeader}>Match Statistics</Text>
          
          {homeStats && awayStats && [
            renderStatItem(
              "Ball Possession",
              homeStats.find(s => s.type === "Ball Possession")?.value,
              awayStats.find(s => s.type === "Ball Possession")?.value
            ),
            renderStatItem(
              "Total Shots",
              homeStats.find(s => s.type === "Total Shots")?.value,
              awayStats.find(s => s.type === "Total Shots")?.value
            ),
            renderStatItem(
              "Shots on Goal",
              homeStats.find(s => s.type === "Shots on Goal")?.value,
              awayStats.find(s => s.type === "Shots on Goal")?.value
            ),
            renderStatItem(
              "Corner Kicks",
              homeStats.find(s => s.type === "Corner Kicks")?.value,
              awayStats.find(s => s.type === "Corner Kicks")?.value
            ),
            renderStatItem(
              "Total Passes",
              homeStats.find(s => s.type === "Total passes")?.value,
              awayStats.find(s => s.type === "Total passes")?.value
            ),
            renderStatItem(
              "Passes Accuracy",
              homeStats.find(s => s.type === "Passes %")?.value,
              awayStats.find(s => s.type === "Passes %")?.value
            ),
            renderStatItem(
              "Yellow Cards",
              homeStats.find(s => s.type === "Yellow Cards")?.value,
              awayStats.find(s => s.type === "Yellow Cards")?.value
            ),
            renderStatItem(
              "Red Cards",
              homeStats.find(s => s.type === "Red Cards")?.value,
              awayStats.find(s => s.type === "Red Cards")?.value
            ),
          ]}
        </View>
      ) : (
        renderLineups()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
  },
  teamInfo: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  status: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 15,
  },
  statValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    width: 50,
    textAlign: 'center',
  },
  statName: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  homeBar: {
    backgroundColor: '#3498db',
  },
  awayBar: {
    backgroundColor: '#e74c3c',
  },
  // New styles for lineups
  lineupsContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    padding: 15,
  },
  formationContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  coachesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  coachInfo: {
    flex: 1,
    alignItems: 'center',
  },
  coachPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  coachName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#2c3e50',
  },
  coachDivider: {
    fontSize: 14,
    color: '#7f8c8d',
    marginHorizontal: 10,
  },
  lineupSection: {
    marginBottom: 20,
  },
  lineupSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 5,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamPlayers: {
    flex: 1,
    paddingHorizontal: 5,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerNumber: {
    width: 25,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
  },
  playerPosition: {
    width: 30,
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
    padding: 20,
  },
});

export default FixtureDetail;