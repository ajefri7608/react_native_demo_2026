import {
  getUser,
  QUICK_MS,
  SLOW_MS,
  TIMEOUT_MS,
  wait,
} from '../../shared/api/userApi';
import { selectDraftName } from '../selectors';
import type { AppThunk } from '../types';
import { setUser, setUserLoading } from './userSlice';

export function fetchUserByThunk(): AppThunk {
  return async (dispatch, getState) => {
    const draft = selectDraftName(getState());
    dispatch(setUserLoading('thunk'));
    const user = await getUser(draft, QUICK_MS);
    dispatch(setUser({ name: user.name, source: 'thunk' }));
  };
}

function writeSlowUser(): AppThunk {
  return async (dispatch, getState) => {
    const draft = selectDraftName(getState());
    const user = await getUser(draft, SLOW_MS);
    dispatch(setUser({ name: user.name, source: 'thunk-race' }));
  };
}

function writeTimeout(): AppThunk {
  return async dispatch => {
    await wait(TIMEOUT_MS);
    dispatch(setUser({ name: '逾時', source: 'thunk-race' }));
  };
}

export function runThunkRace(): AppThunk {
  return async dispatch => {
    dispatch(setUserLoading('thunk-race'));
    await Promise.race([dispatch(writeSlowUser()), dispatch(writeTimeout())]);
  };
}
