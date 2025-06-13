import { useTheme } from '../../contexts/ThemeContext';

export const useSliderCommonProps = () => {
  const { isDarkMode } = useTheme();

  return {
    trackStyle: {
      backgroundColor: isDarkMode ? '#0462c6' : '#9cccff',
      height: 6,
    },
    handleStyle: {
      borderColor: isDarkMode ? '#0462c6' : '#9cccff',
      height: 20,
      width: 20,
      marginTop: -7,
      backgroundColor: 'white',
    },
    railStyle: {
      backgroundColor: '#ccc',
      height: 6,
    },
  };
};
