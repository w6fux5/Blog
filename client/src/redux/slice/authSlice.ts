/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { User } from '../../models';

// register action
export const registerUserAction = createAsyncThunk(
  'auth/register',
  async (user: User, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        'api/v1/auth/register',
        user,
        config,
      );
      return data;
    } catch (error : any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  },
);

export interface AuthState {
  isLoggedIn: boolean;
  logging?: boolean;
  error?: string;
  currentUser?: User;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  currentUser: undefined,
  error: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signUp(state, action: PayloadAction<User>) {
      state.logging = true;
    },

    signUpSuccess(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
      state.error = undefined;
    },

    signUpFailed(state, action: PayloadAction<string>) {
      state.logging = false;
      state.currentUser = undefined;
      state.error = action.payload;
    },

    // logout(state) {
    //   state.isLoggedIn = false;
    //   state.currentUser = undefined;
    // },
  },

});

// Actions
export const {
  signUp, signUpSuccess, signUpFailed,
} = authSlice.actions;

// Reducer
export const authReducer = authSlice.reducer;
// export default authReducer;
