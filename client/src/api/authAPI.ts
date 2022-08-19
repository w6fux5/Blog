// import axios from 'axios';
import { axiosFetch } from '../config/axiosConfig';

const API_ENDPOINT = '/auth/register';

export const registerAPI = async (formData: any) => axiosFetch.post(
  `${API_ENDPOINT}`,
  { ...formData },
);
