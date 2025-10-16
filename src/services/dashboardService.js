import axios from 'axios'
import { api } from "../services/authService";
// const BASE_URL = import.meta.env.VITE_API_URL
// import { API_URL } from '@env'; // ✅ Make sure this matches your .env variable

// const BASE_URL = API_URL; // ✅ Now this is defined properly

// export const getActiveTag = (data) => axios.get(`${BASE_URL}/api/tag/get-all-active-tag`, data)

export const getActiveTag = () => {
  return api.get(`/api/tag/get-all-active-tag`);
};

export const getUserTagByTagID = (tagID) => {
  return api.get(`/api/tag/get-all-user-tag-id/${tagID}`);
};