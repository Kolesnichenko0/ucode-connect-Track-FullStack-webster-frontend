import { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { AuthProvider } from '../contexts/AuthContext';
import authService from '../services/authService';
import csrfService from '../services/csrfService';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NextPage } from 'next';
import '../styles/themes.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

function MyApp({ Component, pageProps }: AppProps & {Component: NextPage & { hideFooter?: boolean }}) {
  const router = useRouter();
  
  const hideFooter = Component.hideFooter;
  
  const isPublicPath = publicPaths.some(path => 
    router.pathname === path || router.pathname.startsWith('/reset-password/')
  );

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
              <Component {...pageProps} />
            </main>
            {!hideFooter && <Footer />}
            {/* Add ToastContainer here */}
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

