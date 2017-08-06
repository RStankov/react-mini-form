import theme from './theme';

export default function createTheme(newTheme) {
  return {
    ...theme,
    ...newTheme,
  };
}
