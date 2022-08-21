import {
  takeLatest, put, fork, call,
} from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { signUp, signUpSuccess, signUpFailed } from './authSlice';

import { registerAPI } from '../api';

function* registerAsync(action: PayloadAction) {
  try {
    const { payload } = action;
    const { data } = yield call(registerAPI, payload);
    const { user } = data || {};
    yield put(signUpSuccess(user));
  } catch (error: any) {
    yield put(signUpFailed(error));
  }
}

function* registerWatcher() {
  yield takeLatest(signUp.type, registerAsync);
}

export const authSagas = [fork(registerWatcher)];
