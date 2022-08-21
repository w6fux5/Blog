/* eslint-disable no-param-reassign */
import axios from 'axios';
import { toast } from 'react-toastify';
// import type { AxiosRequestConfig } from 'axios';

const baseConfig = {
  baseURL: '/api/v1',
  timeout: 1000 * 60,
  timeoutErrorMessage: 'fetchTimeout',
};

// Authorization
export const authFetch = axios.create(baseConfig);

authFetch.interceptors.request.use(
  (config) => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => Promise.reject(error),
);

authFetch.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// Un-Authorization
export const axiosFetch = axios.create(baseConfig);

axiosFetch.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    let message: string = '';
    const { response } = error || {};
    if (!response?.data) {
      message = error.message;
    } else {
      message = response.data.message;
    }

    toast.error(message);
    return Promise.reject(message);
  },
);
