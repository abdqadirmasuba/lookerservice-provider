import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorSchemeName;
}

const initialState: ThemeState = {
  mode: 'system',
  colorScheme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setColorScheme: (state, action: PayloadAction<ColorSchemeName>) => {
      state.colorScheme = action.payload;
    },
  },
});

export const { setThemeMode, setColorScheme } = themeSlice.actions;
export default themeSlice.reducer;