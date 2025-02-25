// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import gameReducer from './gameSlice';

const store = configureStore({
  reducer: {
    player: playerReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
