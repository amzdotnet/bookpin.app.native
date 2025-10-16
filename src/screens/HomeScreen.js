import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
import { api } from "../services/authService";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const [roleList, setRoleList] = useState([]);
  const [gridLoading, setGridLoading] = useState(false);
  const navigation = useNavigation();


//   const loadActiveTags = useCallback(async () => {
//     setGridLoading(true);
//     try {
//         debugger
//         const token = await AsyncStorage.getItem('cygnus.token');
//     const response = await api.get('http://10.0.2.2:5118/api/tag/get-all-active-tag', {
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`,
//   },
// });
//       setRoleList(response.data.tagDtoList); 
//       // const res = await getTagsActive();
//       // const roles = res.data.tagDtoList || [];
//       // setRoleList(roles);
//     } finally {
//       setGridLoading(false);
//     }
//   }, []);

const loadActiveTags = useCallback(async () => {
  setGridLoading(true);
  try {
    const response = await api.get('/api/tag/get-all-active-tag');
    console.log('API tag response:', response); // Add this for debugging
    setRoleList(response.tagDtoList); 
  } catch (error) {
    console.error('Failed to load tags:', error);
  } finally {
    setGridLoading(false);
  }
}, []);




  useEffect(() => {
    loadActiveTags();
  }, [loadActiveTags]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>{item.name}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardText}>
          <Text style={styles.bold}>Name: </Text> {item.name}
        </Text>
        <Text style={styles.cardDesc}>
          <Text style={styles.bold}>Description: </Text>{' '}
          {item.desc || 'No description available'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('TagInformation', { tagID: item.tagID })
          }
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (gridLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <FlatList
      data={roleList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      numColumns={2} // Grid layout
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    backgroundColor: '#007bff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardBody: {
    padding: 15,
    justifyContent: 'space-between',
  },
  cardText: {
    marginBottom: 5,
    fontSize: 14,
  },
  cardDesc: {
    marginBottom: 10,
    fontSize: 13,
    color: '#6c757d',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// import React from 'react';


export default HomeScreen;



// import React, { useState, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Alert,
//   RefreshControl 
// } from "react-native";
// import { getItems, clearAllItems } from "../utils/storage";
// import { useShare } from "../context/ShareContext";

// const HomeScreen = ({ navigation }) => {
//   const [items, setItems] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const { sharedData } = useShare();

//   useEffect(() => {
//     loadItems();
    
//     // If we have shared data, navigate to Share screen
//     if (sharedData) {
//       navigation.navigate('Share');
//     }
//   }, [sharedData]);

//   const loadItems = async () => {
//     const savedItems = await getItems();
//     setItems(savedItems);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadItems();
//     setRefreshing(false);
//   };

//   const confirmClearAll = () => {
//     Alert.alert(
//       "Clear All Items",
//       "Are you sure you want to delete all saved items?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Yes", onPress: clearAllItemsHandler }
//       ]
//     );
//   };

//   const clearAllItemsHandler = async () => {
//     const success = await clearAllItems();
//     if (success) {
//       setItems([]);
//       Alert.alert("Success", "All items have been deleted");
//     } else {
//       Alert.alert("Error", "Failed to delete items");
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.item}
//       onPress={() => navigation.navigate('Detail', { item })}
//     >
//       <Text style={styles.itemName}>{item.name}</Text>
//       <Text style={styles.itemTag}>{item.tag}</Text>
//       <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
//       <Text style={styles.itemPreview}>
//         {item.mimeType?.startsWith('image/') ? 'Image' : 
//          item.sharedData?.substring(0, 30) + (item.sharedData?.length > 30 ? '...' : '')}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Saved Items</Text>
      
//       {items.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No items saved yet</Text>
//           <Text style={styles.emptySubText}>
//             Share content from other apps to save it here
//           </Text>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={items}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//             refreshControl={
//               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
//           />
//           <TouchableOpacity 
//             style={styles.clearButton}
//             onPress={confirmClearAll}
//           >
//             <Text style={styles.clearButtonText}>Clear All Items</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: '#333',
//   },
//   item: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   itemTag: {
//     color: '#6200ee',
//     marginTop: 5,
//     fontWeight: '500',
//   },
//   itemDate: {
//     color: '#999',
//     fontSize: 12,
//     marginTop: 5,
//   },
//   itemPreview: {
//     color: '#666',
//     fontSize: 14,
//     marginTop: 5,
//     fontStyle: 'italic',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#999',
//     marginBottom: 10,
//   },
//   emptySubText: {
//     textAlign: 'center',
//     color: '#999',
//     fontSize: 14,
//   },
//   clearButton: {
//     backgroundColor: '#ff3b30',
//     padding: 15,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   clearButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default HomeScreen;