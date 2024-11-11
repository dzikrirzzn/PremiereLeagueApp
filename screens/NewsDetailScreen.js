import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Linking, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewsDetailScreen = ({ route, navigation }) => {
  const [newsItem, setNewsItem] = useState(route.params?.newsItem || null);
  
  useEffect(() => {
    if (newsItem) {
      saveNewsItemToStorage(newsItem);
    } else {
      loadNewsItemFromStorage();
    }
  }, []);

  // Save news item to AsyncStorage
  const saveNewsItemToStorage = async (item) => {
    try {
      await AsyncStorage.setItem(`news_${item.id}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving news item:', error);
    }
  };

  // Load news item from AsyncStorage
  const loadNewsItemFromStorage = async () => {
    try {
      const storedItem = await AsyncStorage.getItem(`news_${route.params?.newsItem?.id}`);
      if (storedItem) {
        setNewsItem(JSON.parse(storedItem));
      }
    } catch (error) {
      console.error('Error loading news item:', error);
    }
  };

  if (!newsItem) {
    return (
      <View style={styles.center}>
        <Text>Loading news details...</Text>
      </View>
    );
  }

  // Render additional images if any
  const renderAdditionalImages = ({ item }) => (
    <Image source={{ uri: item }} style={styles.additionalImage} />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Main Image */}
      <Image source={{ uri: newsItem.images[0] }} style={styles.newsImage} />
      
      {/* Headline and Date */}
      <Text style={styles.newsTitle}>{newsItem.headline}</Text>
      <Text style={styles.newsDate}>{new Date(newsItem.published).toDateString()}</Text>
      
      {/* News Description */}
      <Text style={styles.newsDescription}>{newsItem.description}</Text>
      
      {/* Category */}
      <Text style={styles.category}>Category: {newsItem.category ? newsItem.category.description : 'Not available'}</Text>

      {/* Optional Additional Images */}
      {newsItem.images.length > 1 && (
        <View style={styles.imageGallery}>
          <Text style={styles.imageGalleryTitle}>Additional Images</Text>
          <FlatList
            data={newsItem.images.slice(1)}
            renderItem={renderAdditionalImages}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      
      {/* Full Article Link */}
      {newsItem.link && (
        <Button 
          title="Read Full Article" 
          onPress={() => Linking.openURL(newsItem.link)} 
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  newsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  newsDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  imageGallery: {
    marginBottom: 16,
  },
  imageGalleryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  additionalImage: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
  },
});

export default NewsDetailScreen;
