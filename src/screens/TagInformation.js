import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { getUserTagByTagID } from '../services/dashboardService';

const TagInformation = ({ route }) => {
  const { tagID } = route.params;
  const [userTagList, setUserTagList] = useState([]);
  const [loading, setLoading] = useState(false);

  // const handleUserTag = async id => {
  //   try {
  //     setLoading(true);
  //     const res = await getUserTagByTagID(id);
  //     const userTags = res.data.userTagDtoList || [];
  //     setUserTagList(userTags);
  //   } catch (error) {
  //     console.error('Error fetching tag:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUserTag = async (id) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('cygnus.token');
    const res = await getUserTagByTagID(id, token);
    const userTags = res.data.userTagDtoList || [];
    setUserTagList(userTags);
  } catch (error) {
    console.error('Error fetching tag:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (tagID) {
      handleUserTag(tagID);
    }
  }, [tagID]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Description:</Text>{' '}
        {item.desc || 'No description'}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Created By:</Text> {item.userName || 'N/A'}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Link: </Text>
        {item.link ? (
          <Text style={styles.link} onPress={() => Linking.openURL(item.link)}>
            {item.link}
          </Text>
        ) : (
          'No Link Found'
        )}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.bold}>Created On:</Text>{' '}
        {item.createdOn
          ? new Date(item.createdOn).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : 'N/A'}
      </Text>

      <Text
        style={[
          styles.text,
          { color: item.isActive ? '#16a34a' : '#dc2626', fontWeight: '600' },
        ]}
      >
        <Text style={styles.bold}>Status:</Text>{' '}
        {item.isActive ? 'Active ✅' : 'Inactive ❌'}
      </Text>

      {item.fileBase64 && (
        <TouchableOpacity onPress={() => Linking.openURL(item.fileBase64)}>
          <Image source={{ uri: item.fileBase64 }} style={styles.image} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Tags</Text>
      {userTagList.length > 0 ? (
        <FlatList
          data={userTagList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1} // you can change to 2 for grid layout
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noData}>No user tags found for this Tag.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    alignSelf: 'flex-start',
    paddingBottom: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
    color: '#475569',
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  image: {
    width: 300,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  noData: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TagInformation;