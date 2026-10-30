import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, QUICK_MS } from '../../shared/api/userApi';

export const fetchUserAsync = createAsyncThunk(
  'user/fetchAsync',
  (name: string) => getUser(name, QUICK_MS),
);
