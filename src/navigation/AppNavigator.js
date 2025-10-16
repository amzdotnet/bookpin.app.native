// import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ShareHandler from '../components/ShareHandler';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import ShareScreen from '../screens/ShareScreen';
import TagInformation from '../screens/TagInformation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null); // null means loading

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('cygnus.token');
        const loginTime = await AsyncStorage.getItem('loginTime');

        if (!token || !loginTime) {
          setInitialRoute('Login');
          return;
        }

        const now = Date.now();
        const loginTimestamp = parseInt(loginTime, 10);
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        // const twoMinutesInMs = 2 * 60 * 1000; // 2 minutes in milliseconds

        if (now - loginTimestamp > twoDaysInMs) {
          // Token expired
          await AsyncStorage.removeItem('cygnus.token');
          await AsyncStorage.removeItem('loginTime');
          setInitialRoute('Login');
        } else {
          setInitialRoute('Dashboard');
        }
      } catch (err) {
        console.error('Login check failed:', err);
        setInitialRoute('Login');
      }
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) {
    // Jab tak check ho raha hai, kuch mat dikhao
    return null;
  }
  return (
    <NavigationContainer>
      <ShareHandler/>
      <Stack.Navigator
        initialRouteName={initialRoute} // ✅ Safe usage now
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="TagInformation"
          component={TagInformation}
          options={{ title: 'Tag Details' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'My Saved Items' }}
        />
        <Stack.Screen
          name="Share"
          component={ShareScreen}
          options={{ title: 'Save Shared Content' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Item Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
