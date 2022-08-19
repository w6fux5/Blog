import {
  takeLatest, put, fork, call,
} from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { signUp, signUpSuccess, signUpFailed } from '../slice/authSlice';

import { registerAPI } from '../../api/authAPI';

function* registerAsync(action: PayloadAction) {
  try {
    const { payload } = action;
    const { data } = yield call(registerAPI, payload);
    const { user } = data || {};
    yield put(signUpSuccess(user));
  } catch (error: any) {
    const { response } = error || {};
    if (!response?.data) {
      yield put(signUpFailed(error.message));
      return;
    }
    yield put(signUpFailed(response.data.message));
  }
}

function* registerWatcher() {
  yield takeLatest(signUp.type, registerAsync);
}

export const authSagas = [fork(registerWatcher)];
