import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const ITEMS_KEY = '@saved_items';

// export const saveItem = async (item) => {
//   try {
//     const existingItems = await getItems();
//     const newItems = [...existingItems, item];
//     await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(newItems));
//     return true;
//   } catch (error) {
//     console.error('Error saving item:', error);
//     return false;
//   }
// };

export const saveItem = async (item) => {
  var itemA = item;
  const token = await AsyncStorage.getItem('cygnus.token');
  try {
    const response = await axios.post(
      'http://10.0.2.2:5118/api/usertag/post-user-tag',
      item, // this is the request body (data)
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    if (response.status != 200) {
      console.error('❌ Failed to save item:', response.status, errorText);
      return false;
    }


    console.log('Item saved to API:');
    return true;
  } catch (error) {
    console.error('API Error:', error);
    return false;
  }
};


export const getItems = async () => {
  try {
    const items = await AsyncStorage.getItem(ITEMS_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
};

export const clearAllItems = async () => {
  try {
    await AsyncStorage.removeItem(ITEMS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing items:', error);
    return false;
  }
};