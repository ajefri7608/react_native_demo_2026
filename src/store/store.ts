import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { bindAccessToken } from '../shared/api/token';
import { rootSaga } from './rootSaga';
import { selectAccessToken } from './selectors';
import { appReducer } from './types';

export function createAppStore() {
  const sagaMiddleware = createSagaMiddleware();
  const appStore = configureStore({
    reducer: appReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);
  return appStore;
}

export const store = createAppStore();

bindAccessToken(() => selectAccessToken(store.getState()));

export type AppDispatch = typeof store.dispatch;
