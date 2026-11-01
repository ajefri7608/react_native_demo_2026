import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './types';

export const selectDraftName = (state: RootState) => state.user.draftName;
export const selectUserName = (state: RootState) => state.user.name;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserSource = (state: RootState) => state.user.source;
export const selectUserLog = (state: RootState) => state.user.log;
export const selectUser = (state: RootState) => state.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsSignedIn = (state: RootState) =>
  state.auth.accessToken !== null;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectCartCount = (state: RootState) => state.cart.count;
export const selectExpress = (state: RootState) => state.cart.isExpressMode;

export const selectNameExpress = createSelector(
  [selectUserName, selectExpress],
  (name, isExpressMode) => ({ name, isExpressMode }),
);
