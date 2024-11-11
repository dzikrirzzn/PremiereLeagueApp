import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const TeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]); // State to store team data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Attempt to load cached data first
        const cachedData = await AsyncStorage.getItem("teamsData");
        if (cachedData) {
          setTeams(JSON.parse(cachedData));
          setLoading(false);
        }

        // Fetch data from API
        const response = await axios.get("https://english-premiere-league1.p.rapidapi.com/team/list?limit=20", {
          headers: {
            "x-rapidapi-key": "b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446",
            "x-rapidapi-host": "english-premiere-league1.p.rapidapi.com",
          },
        });

        setTeams(response.data);
        setLoading(false);

        // Cache data in AsyncStorage
        await AsyncStorage.setItem("teamsData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamPress = (team) => {
    navigation.navigate("TeamDetail", { teamId: team.id }); // Navigate to detail screen
  };

  const renderTeam = ({ item }) => (
    <TouchableOpacity style={styles.teamCard} onPress={() => handleTeamPress(item)}>
      <Image source={{ uri: item.logos[0] }} style={styles.teamLogo} />
      <Text style={styles.teamName}>{item.displayName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No teams available</Text>
      </View>
    );
  }

  return <FlatList data={teams} renderItem={renderTeam} keyExtractor={(item) => item.id.toString()} style={styles.container} />;
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
  teamCard: {
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
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});

export default TeamsScreen;
