/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ResponseUser, AuthUser } from '../types';

export interface AuthState {
  isLoggedIn: boolean;
  loading?: boolean;
  error?: string;
  currentUser?: ResponseUser;
}

const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  currentUser: undefined,
  error: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signUp(state, action: PayloadAction<AuthUser>) {
      state.loading = true;
    },

    signUpSuccess(state, action: PayloadAction<ResponseUser>) {
      state.isLoggedIn = true;
      state.loading = false;
      state.currentUser = action.payload;
      state.error = undefined;
    },

    signUpFailed(state, action: PayloadAction<string>) {
      state.loading = false;
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
