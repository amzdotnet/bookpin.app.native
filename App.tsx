import React from 'react';
import { ShareProvider } from './src/context/ShareContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import ShareHandler from './src/components/ShareHandler'; // Import ShareHandler

const App = () => {
  return (
    <ShareProvider>
      <ShareHandler /> {/* Add ShareHandler inside ShareProvider */}
      <AppNavigator />
      <Toast />
    </ShareProvider>
  );
};

export default App;