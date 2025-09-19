import axios from 'axios'
// const BASE_URL = import.meta.env.VITE_API_URL
// import { API_URL } from '@env'; // ✅ Make sure this matches your .env variable

// const BASE_URL = API_URL; // ✅ Now this is defined properly

// export const getActiveTag = (data) => axios.get(`${BASE_URL}/api/tag/get-all-active-tag`, data)

export const getActiveTag = (token) => {
  return axios.get(`http://10.0.2.2:5118/api/tag/get-all-active-tag`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getUserTagByTagID = (tagID, token) => {
  return axios.get(`http://10.0.2.2:5118/api/tag/get-all-user-tag-id/${tagID}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};