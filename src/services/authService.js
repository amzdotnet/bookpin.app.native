import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../constants/environment';
import { View } from 'react-native'; // ✅ Import View

// Create an axios instance (similar to Angular's HttpClient)
const api = axios.create({
  baseURL: environment.basePath, // e.g., 'http://10.148.54.175:5000'
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Add timeout to prevent hanging requests
});




// Request Interceptor (like Angular's HttpInterceptor)
api.interceptors.request.use(
  async (config) => {
    console.log(`Making API request to: ${config.url}`);
    
    // Add token to headers if it exists
    try {
      const token = await AsyncStorage.getItem(environment.tokenIdentifier);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token added to request headers');
      }
    } catch (tokenError) {
      console.warn('Could not retrieve token from storage:', tokenError);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
    // Return response data directly
    return response.data;
  },
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        console.log('Unauthorized access - removing token');
        try {
          await AsyncStorage.removeItem(environment.tokenIdentifier);
        } catch (storageError) {
          console.warn('Could not remove token:', storageError);
        }
        return Promise.reject({ 
          message: 'Session expired, please log in again',
          status: 401 
        });
      }
      
      // Return the server's error response
      return Promise.reject(error.response.data || { 
        message: `Server error: ${error.response.status}`,
        status: error.response.status
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({ 
        message: 'Network error: Cannot connect to server. Please check your connection.',
        isNetworkError: true
      });
    } else {
      // Something else happened
      return Promise.reject({ 
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

// Login function - UPDATED with correct field names
export const doLogin = async (resource) => {
  
  try {
    console.log('Attempting login with credentials:', { 
      id: resource.id,
      // Don't log password for security
    });
    
    // Use the correct endpoint from Angular version
    const data = await api.post('/api/auth/user', resource);
    console.log('Full backend response structure:', data);
    
    const { token } = data; // ✅ Get token from response
    // Use the exact field names from Angular response (lowercase)
    if (data.token) {
      try {

        // Store all authentication data
        // await AsyncStorage.setItem(environment.tokenIdentifier, data.token);
        // await AsyncStorage.setItem(environment.tokenIdentifier, JSON.stringify(data.token));
        await AsyncStorage.setItem(environment.tokenIdentifier, data.token);

        console.log('Login successful - user data stored');
        return { 
          success: true, 
          message: 'Welcome to Book Pin!',
          token: token  // ✅ Send token back to LoginScreen
        };
      } catch (storageError) {
        console.error('AsyncStorage error:', storageError);
        return { 
          success: false, 
          message: 'Failed to store login data. Please try again.' 
        };
      }
    } else {
      // Use the exact field name from Angular response
      return { 
        success: false, 
        message: 'Login failed. Please check your credentials.' 
      };
    }
  } catch (error) {
    console.error('Login process error:', error);
  
    return { 
      success: false, 
      message: error.message || 'An error occurred during login. Please try again.',
      isNetworkError: error.isNetworkError
    };
  }
};

// Logout function
export const doLogout = async () => {
  try {
    await AsyncStorage.removeItem(environment.tokenIdentifier);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Check if user is logged in
export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem(environment.tokenIdentifier);
    return !!(token);
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get stored user data
export const getUserData = async () => {
  try {
    const userString = await AsyncStorage.getItem(environment.userIdentifier);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Check server connection
export const checkServerConnection = async () => {
  try {
    const response = await api.get(`/api/auth/health`, {
      timeout: 5000
    });
    return { 
      connected: true, 
      message: 'Server is reachable',
      status: response.status
    };
  } catch (error) {
    return { 
      connected: false, 
      message: 'Cannot connect to server. Please check the IP address and network connection.',
      error: error.message
    };
  }
};

// Export axios instance for other API calls
export { api };