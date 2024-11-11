import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'teamDetailsCache';
const CACHE_DURATION = 1000 * 60 * 5; // Cache duration: 5 minutes

const TeamDetailScreen = ({ route }) => {
  const { teamId } = route.params;
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const cache = await AsyncStorage.getItem(`${CACHE_KEY}_${teamId}`);
        if (cache) {
          const cachedData = JSON.parse(cache);
          if (new Date().getTime() - cachedData.timestamp < CACHE_DURATION) {
            setTeamDetails(cachedData.data);
            return;
          }
        }

        const response = await axios.get(`https://english-premiere-league1.p.rapidapi.com/team/info?teamId=${teamId}`, {
          headers: {
            'x-rapidapi-key': 'b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446',
            'x-rapidapi-host': 'english-premiere-league1.p.rapidapi.com',
          },
        });

        setTeamDetails(response.data);

        await AsyncStorage.setItem(
          `${CACHE_KEY}_${teamId}`,
          JSON.stringify({ data: response.data, timestamp: new Date().getTime() })
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  if (!teamDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { displayName, location, logos, links, nextEvent } = teamDetails;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: logos[0] }} style={styles.logo} />
        <Text style={styles.teamName}>{displayName}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      {/* Next Event Section */}
      {nextEvent && nextEvent.length > 0 && (
        <View style={styles.nextEventContainer}>
          <Text style={styles.nextEventHeader}>Next Event:</Text>
          <Text style={styles.nextEventText}>{nextEvent[0].name}</Text>
          <Text style={styles.nextEventDate}>
            Date: {new Date(nextEvent[0].date).toLocaleString()}
          </Text>
        </View>
      )}

      <View style={styles.linksContainer}>
        <Text style={styles.linkHeader}>More Information:</Text>
        {links.map((link, index) => (
          <Text 
            key={index} 
            style={styles.link} 
            onPress={() => Linking.openURL(link.href)}
          >
            {link.description}
          </Text>
        ))}
      </View>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  nextEventContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextEventHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  nextEventText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },
  nextEventDate: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  linksContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 8,
    paddingVertical: 4,
  },
});

export default TeamDetailScreen;
