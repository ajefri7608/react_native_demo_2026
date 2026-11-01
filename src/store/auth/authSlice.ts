import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginRequest } from '../../shared/api/authApi';
import type { LoginResult } from '../../shared/api/types';

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type AuthState = {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  status: AuthStatus;
  error: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  (body: { username: string; password: string }) => loginRequest(body),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.tokenType = null;
      state.expiresIn = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const result: LoginResult = action.payload;
        state.accessToken = result.accessToken;
        state.tokenType = result.tokenType;
        state.expiresIn = result.expiresIn;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.accessToken = null;
        state.status = 'failed';
        state.error = action.error.message ?? '登入失敗';
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
