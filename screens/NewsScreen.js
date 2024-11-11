import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const cachedNews = await AsyncStorage.getItem('newsData');

      if (cachedNews) {
        setNews(JSON.parse(cachedNews));
        setLoading(false);
      }

      const options = {
        method: 'GET',
        url: 'https://english-premiere-league1.p.rapidapi.com/news',
        headers: {
          'X-RapidAPI-Key': 'b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446',
          'X-RapidAPI-Host': 'english-premiere-league1.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      setNews(response.data);
      await AsyncStorage.setItem('newsData', JSON.stringify(response.data));
      setLoading(false);

    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const renderNewsItem = ({ item }) => {
    const imageUri = item.images && item.images.find(img => img)
                      ? item.images.find(img => img)
                      : require('../assets/news-placeholder.png');

    return (
      <TouchableOpacity onPress={() => navigation.navigate('NewsDetailScreen', { newsItem: item })}>
        <View style={styles.newsCard}>
          <Image source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri} style={styles.newsImage} />
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{item.headline}</Text>
            <Text style={styles.newsDate}>{new Date(item.published).toDateString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={(item, index) => index.toString()}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsCard: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});

export default NewsScreen;
