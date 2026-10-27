import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './rootSaga';
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

export type AppDispatch = typeof store.dispatch;
