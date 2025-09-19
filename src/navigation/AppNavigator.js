import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ShareHandler from '../components/ShareHandler';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import ShareScreen from '../screens/ShareScreen';
import TagInformation from '../screens/TagInformation'; // 👈 Add this

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <ShareHandler />
      <Stack.Navigator
        initialRouteName="Login"  // 👈 Always open Login first
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
          name="TagInformation" // ✅ Fix
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
