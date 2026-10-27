import {
  combineReducers,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const appReducer = combineReducers(rootReducer);

export type RootState = ReturnType<typeof appReducer>;

export type AppThunk<Return = void> = ThunkAction<
  Promise<Return>,
  RootState,
  undefined,
  UnknownAction
>;
