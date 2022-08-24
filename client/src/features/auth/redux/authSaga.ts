import { takeLatest, put, fork, call } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { AxiosResponse } from 'axios';

import { push } from 'connected-react-router';

import { AuthUser } from '../types';

import {
  signUp,
  signUpSuccess,
  signUpFailed,
  signIn,
  signInSuccess,
  signInFailed,
} from './authSlice';

import { registerAPI, loginAPI } from '../api';

//= 註冊 ===//
function* registerAsync(action: PayloadAction<AuthUser>) {
  try {
    const { payload } = action;
    const { data }: AxiosResponse = yield call(registerAPI, payload);
    const { user } = data || {};
    yield put(signUpSuccess(user));
  } catch (error: any) {
    yield put(signUpFailed(error));
  }
}

function* registerWatcher() {
  yield takeLatest(signUp.type, registerAsync);
}
//= END ===//

//= 登入 ===//
function* loginAsync(action: PayloadAction<AuthUser>) {
  try {
    const { payload } = action;
    const { data }: AxiosResponse = yield call(loginAPI, payload);
    const { user } = data || {};
    yield put(signInSuccess(user));
    yield put(push('/'));
  } catch (error: any) {
    yield put(signInFailed(error));
  }
}

function* loginWatcher() {
  yield takeLatest(signIn.type, loginAsync);
}
//= END ===//

export const authSagas = [fork(registerWatcher), fork(loginWatcher)];
