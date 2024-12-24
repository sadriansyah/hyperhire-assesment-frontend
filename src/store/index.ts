

import { configureStore } from '@reduxjs/toolkit';
import menusReducer from './menuSlice';

const store = configureStore({
  reducer: {
    menus: menusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
