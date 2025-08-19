import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/themes.css';
import '../styles/editor.css';
import '../styles/main.css';
import '../styles/projects.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import authService from '../services/authService';
import csrfService from '../services/csrfService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NextPage } from 'next';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute';

function MyApp({ Component, pageProps }: AppProps & { Component: NextPage & { hideFooter?: boolean } }) {

  const hideFooter = Component.hideFooter;

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Fetching CSRF token...');
        await csrfService.fetchCsrfToken();
        
        csrfService.setupAxiosInterceptors();
        
        authService.setupInterceptors();
        
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
          authService.setAuthToken(accessToken);
        }
        
        console.log('App initialization completed');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'system';
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDarkMode)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          </main>
          {!hideFooter && <Footer />}
          <ToastContainer
              position="bottom-right"
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
