import { addToCart, toggleExpress } from '../src/store/cart/cartSlice';
import { createAppStore } from '../src/store/store';
import { selectNameExpress, selectUserName } from '../src/store/selectors';
import { setDraftName } from '../src/store/user/userSlice';
import { fetchUserAsync } from '../src/store/user/userAsync';
import {
  fetchUserRaceRequested,
  fetchUserRequested,
} from '../src/store/user/userSaga';
import { fetchUserByThunk, runThunkRace } from '../src/store/user/userThunks';
import {
  HORIZONTAL_ACTIVATION,
  VERTICAL_FAIL,
} from '../src/shared/ui/tabGesture';
import { QUICK_MS, SLOW_MS, TIMEOUT_MS } from '../src/shared/api/userApi';

describe('value flow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps the nested tab swipe from winning a vertical drag', () => {
    expect(VERTICAL_FAIL).toBeLessThan(HORIZONTAL_ACTIVATION);
  });

  it('writes a name through a thunk without touching the cart', async () => {
    const store = createAppStore();
    store.dispatch(setDraftName('Mia'));
    const pending = store.dispatch(fetchUserByThunk());
    await jest.advanceTimersByTimeAsync(QUICK_MS);
    await pending;

    expect(selectUserName(store.getState())).toBe('Mia');
    expect(store.getState().user.source).toBe('thunk');
    expect(store.getState().cart.count).toBe(0);
  });

  it('lets the losing thunk overwrite the store after Promise.race', async () => {
    const store = createAppStore();
    store.dispatch(setDraftName('Mia'));
    const pending = store.dispatch(runThunkRace());
    await jest.advanceTimersByTimeAsync(TIMEOUT_MS);
    expect(selectUserName(store.getState())).toBe('逾時');

    await jest.advanceTimersByTimeAsync(SLOW_MS);
    await pending;
    expect(selectUserName(store.getState())).toBe('Mia');
  });

  it('does not let the losing saga write after race', async () => {
    const store = createAppStore();
    store.dispatch(setDraftName('Mia'));
    store.dispatch(fetchUserRaceRequested());
    await jest.advanceTimersByTimeAsync(TIMEOUT_MS);
    expect(selectUserName(store.getState())).toBe('逾時');

    await jest.advanceTimersByTimeAsync(SLOW_MS);
    expect(selectUserName(store.getState())).toBe('逾時');
    expect(store.getState().user.source).toBe('saga-race');
  });

  it('writes the same field from a saga worker', async () => {
    const store = createAppStore();
    store.dispatch(setDraftName('Ken'));
    store.dispatch(fetchUserRequested());
    await jest.advanceTimersByTimeAsync(QUICK_MS);
    expect(selectUserName(store.getState())).toBe('Ken');
    expect(store.getState().user.source).toBe('saga');
  });

  it('writes through createAsyncThunk extraReducers', async () => {
    const store = createAppStore();
    const pending = store.dispatch(fetchUserAsync('Ada'));
    await jest.advanceTimersByTimeAsync(QUICK_MS);
    await pending;
    expect(selectUserName(store.getState())).toBe('Ada');
    expect(store.getState().user.source).toBe('async-thunk');
  });

  it('keeps the reselect result when only the cart count changes', () => {
    const store = createAppStore();
    const first = selectNameExpress(store.getState());
    store.dispatch(addToCart());
    expect(selectNameExpress(store.getState())).toBe(first);

    store.dispatch(toggleExpress());
    const next = selectNameExpress(store.getState());
    expect(next).not.toBe(first);
    expect(next.isExpressMode).toBe(true);
  });
});
