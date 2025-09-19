
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { doLogin } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox

  const tryLogin = async () => {
    if (!id || !password) {
      Toast.show({ type: 'error', text1: 'ID and Password are required' });
      return;
    }

    setLoading(true);
    const resource = { email : id, password : password };
    console.log('Attempting login with:', resource); // Debug log
    const result = await doLogin(resource);
    console.log('Login result:', result); // Debug log
    setLoading(false);

    if (result.success) {
      console.log('Navigating to Dashboard'); // Debug log
       navigation.replace('Dashboard');  // 👈 updated
      Toast.show({ type: 'success', text1: result.message });
    } else {
      if (result.message === 'Session expired, please log in again') {
        Toast.show({ type: 'error', text1: result.message });
        navigation.navigate('Login');
      } else {
        Toast.show({ type: 'error', text1: result.message });
      }
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password clicked'); // Debug log
    // Add navigation or logic for password recovery here
    Toast.show({ type: 'info', text1: 'Forgot Password functionality coming soon!' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Using Account Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Your ID"
        value={id}
        onChangeText={setId}
        keyboardType="default"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Text style={styles.checkboxText}>{rememberMe ? '☑' : '☐'}</Text>
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>
      </View>
      
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={tryLogin}
        disabled={loading}
      />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ccc' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  checkboxText: { fontSize: 20, marginRight: 5 },
  checkboxLabel: { fontSize: 16 },
  forgot: { textAlign: 'right', color: 'blue', marginTop: 10, fontSize: 14 },
});

export default LoginScreen;
