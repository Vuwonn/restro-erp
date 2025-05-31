import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import orderSlice from "./orderSlice";
import cartSlice from "./cartSlice"; // Import cartSlice
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configuration for auth
const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
};

// Persist configuration for order
const orderPersistConfig = {
  key: "order",
  version: 1,
  storage,
  blacklist: ["items"], // Don't persist order items to prevent stale data
};

// Persist configuration for cart
const cartPersistConfig = {
  key: "cart",
  version: 1,
  storage,
  blacklist: ["items", "subtotal", "totalItems"], // Don't persist cart items, subtotal, or totalItems
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedOrderReducer = persistReducer(orderPersistConfig, orderSlice);
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  order: persistedOrderReducer,
  cart: persistedCartReducer, // Add cart reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;