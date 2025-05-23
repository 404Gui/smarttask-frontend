
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLoadingStore } from '@/stores/loadingStore'; 

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


api.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  
  useLoadingStore.getState().startLoading();
  return config;
});


api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading(); 
    return response;
  },
  (error) => {
    useLoadingStore.getState().stopLoading(); 

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      Cookies.remove('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
