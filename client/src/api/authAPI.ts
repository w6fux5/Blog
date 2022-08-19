import axios from 'axios';

const API_ENDPOINT = '/api/v1/auth/register';

export const registerAPI = async (formData: any) => axios.post(
  `${API_ENDPOINT}`,
  { ...formData },
);
