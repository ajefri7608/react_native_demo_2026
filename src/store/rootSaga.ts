import type { SagaIterator } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { userSaga } from './user/userSaga';

export function* rootSaga(): SagaIterator {
  yield fork(userSaga);
}
