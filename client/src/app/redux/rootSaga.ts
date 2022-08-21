import { all } from 'redux-saga/effects';
import { authSagas } from '@/features/auth';

export function* rootSaga() {
  yield all([...authSagas]);
}
