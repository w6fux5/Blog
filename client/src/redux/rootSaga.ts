import { all } from 'redux-saga/effects';
import { authSagas } from './saga/authSaga';

export default function* rootSaga() {
  yield all([...authSagas]);
}
