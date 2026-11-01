import { authReducer } from './auth/authSlice';
import { cartReducer } from './cart/cartSlice';
import { userReducer } from './user/userSlice';

export const rootReducer = {
  user: userReducer,
  cart: cartReducer,
  auth: authReducer,
};
