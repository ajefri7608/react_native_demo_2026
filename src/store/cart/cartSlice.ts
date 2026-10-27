import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0,
    isExpressMode: false,
  },
  reducers: {
    addToCart(state) {
      state.count += 1;
    },
    toggleExpress(state) {
      state.isExpressMode = !state.isExpressMode;
    },
  },
});

export const { addToCart, toggleExpress } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
