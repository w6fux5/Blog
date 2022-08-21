import { axiosFetch } from '@/app/config';

import { AuthUser, LoginUser } from './types';

const REGISTER_API = '/auth/register';
const LOGIN_API = '/auth/login';

export const registerAPI = async (formData: AuthUser) =>
  axiosFetch.post(`${REGISTER_API}`, { ...formData });

export const loginAPI = async (formData: LoginUser) =>
  axiosFetch.post(`${LOGIN_API}`, { ...formData });
