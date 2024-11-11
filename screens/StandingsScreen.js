import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import axios from "axios";

const StandingsScreen = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024",
        headers: {
          "X-RapidAPI-Key": "509b2a95a9msh3feffa16b6bb594p184467jsn74ea44f78c89",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      setStandings(response.data.response[0].league.standings[0]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getBackgroundColor = (position) => {
    if (position <= 4) return "#d2e4fc"; // UCL
    if (position === 5) return "#fde4c4"; // UEL
    if (position >= 18) return "#fcd2d2"; // Relegation
    return "white"; // Default
  };

  const getMatchIcon = (result) => {
    switch (result) {
      case "W":
        return "✅";
      case "L":
        return "❌";
      case "D":
        return "➖";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with EPL Logo and Text */}
      <View style={styles.header}>
        <Image source={require("../assets/pl-logo.png")} style={styles.logo} />
        <View>
          <Text style={styles.leagueTitle}>Premier League</Text>
          <Text style={styles.season}>Season 2024-25</Text>
        </View>
      </View>

      {/* Standings Table */}
      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: 40 }]}>#</Text>
              <Text style={[styles.headerCell, { width: 180 }]}>Club</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>MP</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>W</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>D</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>L</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>GF</Text>
              <Text style={[styles.headerCell, { width: 40 }]}>GA</Text>
              <Text style={[styles.headerCell, { width: 50 }]}>Points</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Last 5 Matches</Text>
            </View>

            {standings.map((team, index) => (
              <View key={team.team.id} style={[styles.tableRow, { backgroundColor: getBackgroundColor(index + 1) }]}>
                <Text style={[styles.cell, { width: 40 }]}>{team.rank}</Text>
                <View style={[styles.teamInfo, { width: 180 }]}>
                  <View style={styles.teamLogoContainer}>
                    <Image 
                      source={{ uri: team.team.logo }} 
                      style={styles.teamLogo} 
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.teamName} numberOfLines={1}>
                    {team.team.name}
                  </Text>
                </View>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.played}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.win}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.draw}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.lose}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.goals.for}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{team.all.goals.against}</Text>
                <Text style={[styles.cell, { width: 50 }]}>{team.points}</Text>
                <View style={[styles.recentMatches, { width: 120 }]}>
                  {team.form
                    .slice(-5)
                    .split("")
                    .map((result, i) => (
                      <Text key={i} style={styles.matchIcon}>
                        {getMatchIcon(result)}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </View>

         {/* Legend section yang diubah */}
         <View style={styles.legendContainer}>
            <View style={styles.legendColumn}>
              <Text style={styles.legendTitle}>Qualification/Relegation</Text>
              <Text style={styles.legendText}>🔵 Champions League group stage</Text>
              <Text style={styles.legendText}>🟠 Europa League group stage</Text>
              <Text style={styles.legendText}>🔴 Degradation</Text>
            </View>
            <View style={styles.legendDivider} />
            <View style={styles.legendColumn}>
              <Text style={styles.legendTitle}>Last 5 matches</Text>
              <Text style={styles.legendText}>✅ Win</Text>
              <Text style={styles.legendText}>➖ Series</Text>
              <Text style={styles.legendText}>❌ Lost</Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2c3e50",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  leagueTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  
  season: {
    fontSize: 13,
    color: "#9EA3A9",
    fontStyle: "italic",
  },

  tableContainer: {
    minWidth: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2c3e50",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    color: "#2c3e50",
    textAlign: "center",
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5,
  },
  teamLogoContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  teamLogo: {
    width: 24,
    height: 24,
  },
  teamName: {
    flex: 1,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  recentMatches: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  matchIcon: {
    marginHorizontal: 2,
  },
  
  legendContainer: {
    marginTop: 20,
    marginHorizontal: 15,
    paddingBottom: 20,
    flexDirection: 'row', // Mengubah menjadi row untuk tampilan berdampingan
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  legendColumn: {
    flex: 1, // Memberikan flex 1 agar kolom memiliki lebar yang sama
    paddingHorizontal: 10,
  },
  legendDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 15,
  },
  legendTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
    fontSize: 14,
  },
  legendText: {
    marginBottom: 4,
    color: "#2c3e50",
    fontSize: 13,
  }
});

export default StandingsScreen;