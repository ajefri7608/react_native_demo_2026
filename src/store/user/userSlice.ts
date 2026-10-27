import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchUserAsync } from './userAsync';

export type ValueSource =
  | 'promise'
  | 'thunk'
  | 'saga'
  | 'thunk-race'
  | 'saga-race'
  | 'async-thunk';

export type UserStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type UserState = {
  name: string;
  draftName: string;
  status: UserStatus;
  source: ValueSource | null;
  error: string | null;
  log: string[];
};

const initialState: UserState = {
  name: '',
  draftName: '',
  status: 'idle',
  source: null,
  error: null,
  log: [],
};

function stamp() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
}

function pushLog(state: UserState, message: string) {
  state.log.unshift(`${stamp()}  ${message}`);
  state.log.splice(8);
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDraftName(state, action: PayloadAction<string>) {
      state.draftName = action.payload;
    },
    setUserLoading(state, action: PayloadAction<ValueSource>) {
      state.status = 'loading';
      state.source = action.payload;
      state.error = null;
      pushLog(state, `${action.payload} loading`);
    },
    setUser(
      state,
      action: PayloadAction<{ name: string; source: ValueSource }>,
    ) {
      state.name = action.payload.name;
      state.status = 'succeeded';
      state.source = action.payload.source;
      state.error = null;
      pushLog(
        state,
        `${action.payload.source} setUser ${action.payload.name}`,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserAsync.pending, state => {
        state.status = 'loading';
        state.source = 'async-thunk';
        state.error = null;
        pushLog(state, 'async-thunk pending');
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.status = 'succeeded';
        state.source = 'async-thunk';
        state.error = null;
        pushLog(state, `async-thunk fulfilled ${action.payload.name}`);
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.source = 'async-thunk';
        state.error = action.error.message ?? '失敗';
        pushLog(state, 'async-thunk rejected');
      });
  },
});

export const { setDraftName, setUserLoading, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
