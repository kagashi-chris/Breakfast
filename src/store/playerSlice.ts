import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerState {
  hp: number;
}

const initialState: PlayerState = {
  hp: 100,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setHp: (state, action: PayloadAction<number>) => {
      state.hp = action.payload;
    },
    damage: (state, action: PayloadAction<number>) => {
      state.hp = Math.max(state.hp - action.payload, 0);
    },
    heal: (state, action: PayloadAction<number>) => {
      state.hp += action.payload;
    },
  },
});

export const { setHp, damage, heal } = playerSlice.actions;
export default playerSlice.reducer;
