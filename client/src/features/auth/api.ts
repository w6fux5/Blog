// import axios from 'axios';
import { axiosFetch } from '@/app/config/axiosConfig';

import { AuthUser } from './types';

const API_ENDPOINT = '/auth/register';

export const registerAPI = async (formData: AuthUser) => axiosFetch
  .post(`${API_ENDPOINT}`, { ...formData });
