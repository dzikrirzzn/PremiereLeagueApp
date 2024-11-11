// screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/pl-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Premier League App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>
          Premier League App is your ultimate companion for following the English Premier League.
          Stay updated with live scores, fixtures, standings, and the latest news from the most
          exciting football league in the world.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Live match scores and updates</Text>
          <Text style={styles.feature}>• Team information and statistics</Text>
          <Text style={styles.feature}>• League standings</Text>
          <Text style={styles.feature}>• Latest Premier League news</Text>
          <Text style={styles.feature}>• Match details and statistics</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.sectionContent}>
          For support and feedback, please contact us at:
          support@premierleagueapp.com
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.copyright}>
          © 2024 Premier League App. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  featureList: {
    marginTop: 5,
  },
  feature: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProfileScreen;
