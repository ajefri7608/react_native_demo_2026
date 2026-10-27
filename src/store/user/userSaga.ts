import { createAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import {
  call,
  delay,
  fork,
  put,
  race,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { getUser, QUICK_MS, SLOW_MS, TIMEOUT_MS, type User } from '../../shared/api/userApi';
import { selectDraftName } from '../selectors';
import { setUser, setUserLoading } from './userSlice';

export const fetchUserRequested = createAction('user/fetchRequested');
export const fetchUserRaceRequested = createAction('user/fetchRaceRequested');

function* fetchUserWorker(): SagaIterator {
  yield put(setUserLoading('saga'));
  const draft: string = yield select(selectDraftName);
  const user: User = yield call(getUser, draft, QUICK_MS);
  yield put(setUser({ name: user.name, source: 'saga' }));
}

function* fetchUserRaceWorker(): SagaIterator {
  yield put(setUserLoading('saga-race'));
  const draft: string = yield select(selectDraftName);
  const winner: { user?: User; timedOut?: boolean } = yield race({
    user: call(getUser, draft, SLOW_MS),
    timedOut: delay(TIMEOUT_MS),
  });

  if (winner.timedOut || !winner.user) {
    yield put(setUser({ name: '逾時', source: 'saga-race' }));
    return;
  }

  yield put(setUser({ name: winner.user.name, source: 'saga-race' }));
}

function* watchFetchUser(): SagaIterator {
  yield takeLatest(fetchUserRequested.type, fetchUserWorker);
}

function* watchFetchUserRace(): SagaIterator {
  yield takeLatest(fetchUserRaceRequested.type, fetchUserRaceWorker);
}

export function* userSaga(): SagaIterator {
  yield fork(watchFetchUser);
  yield fork(watchFetchUserRace);
}
