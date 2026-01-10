import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setColorScheme, setThemeMode } from '../store/slices/themeSlice';
import { Colors } from '../theme/colors';
import { useEffect } from 'react';

export const useTheme = () => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const { mode, colorScheme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (mode === 'system') {
      dispatch(setColorScheme(systemColorScheme));
    } else {
      dispatch(setColorScheme(mode as 'light' | 'dark'));
    }
  }, [mode, systemColorScheme]);

  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const changeTheme = (newMode: 'light' | 'dark' | 'system') => {
    dispatch(setThemeMode(newMode));
  };

  return {
    isDark,
    colors,
    mode,
    changeTheme,
  };
};