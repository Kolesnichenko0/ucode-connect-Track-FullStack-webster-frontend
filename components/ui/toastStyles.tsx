import { ToastOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastStyles = (isDarkMode: boolean, isError = false): ToastOptions => ({
  position: 'bottom-right' as ToastPosition,
  style: {
    background: isDarkMode ? '#000000' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
  } as React.CSSProperties,
});

export default toastStyles;