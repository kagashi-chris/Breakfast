// src/store/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StageType } from '../types/GameTypes';

interface GameState {
  selectedStage: StageType;
}

const initialState: GameState = {
  selectedStage: 'GlennHM',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setSelectedStage(state, action: PayloadAction<StageType>) {
      state.selectedStage = action.payload;
    },
  },
});

export const { setSelectedStage } = gameSlice.actions;
export default gameSlice.reducer;
