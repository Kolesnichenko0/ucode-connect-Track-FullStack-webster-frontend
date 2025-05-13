import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import Head from 'next/head';

export default function ConfirmEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();
  const { token } = router.query;
  const { verifyEmail } = useAuth();

  useEffect(() => {
    if (token && typeof token === 'string') {
      verifyEmailToken(token);
    }
  }, [token]);

  const verifyEmailToken = async (token: string) => {
    try {
      await verifyEmail(token);
      setIsSuccess(true);
      setMessage('Your email has been successfully verified! You can now log in.');
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Email verification failed. This link may be invalid or expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Confirm Email | GraphiCraft</title>
        <meta name="description" content="Confirm your email address for GraphiCraft" />
      </Head>

      <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="w-full max-w-7xl flex flex-col md:flex-row max-h-7xl md:rounded-xl md:shadow-2xl overflow-hidden">
          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-12 h-[800px] flex items-center justify-center relative z-10 bg-white dark:bg-black">
            <div className="w-full max-w-md">
              {/* Logo for mobile (hidden on desktop) */}
              <div className="flex items-center mb-8 md:hidden">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-600 rounded-lg"></div>
                  <div>
                    <div className="text-xl font-bold">GraphiCraft</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Design without limits</div>
                  </div>
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Email Verification</h1>
                <p className="text-gray-500 dark:text-gray-400">Validating your GraphiCraft account</p>
              </div>

              {isVerifying ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg className="animate-spin h-12 w-12 text-black dark:text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 text-center">{message}</p>
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {isSuccess ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
                      {isSuccess ? 'Verification Complete' : 'Verification Failed'}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                      {message}
                    </p>
                    
                    <div className="w-full">
                      {isSuccess ? (
                        <Link 
                          href="/login" 
                          className="w-full h-12 rounded-none flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                          Sign in now
                        </Link>
                      ) : (
                        <div className="space-y-4">
                          <Link 
                            href="/register" 
                            className="w-full h-12 rounded-none flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          >
                            Try again
                          </Link>
                          <Link 
                            href="/" 
                            className="w-full h-12 rounded-none flex items-center justify-center border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Return to Home
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Jellyfish Section */}
          <div className="w-full md:w-1/2 hidden md:block bg-black relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/images/jellyfish1.png" 
                alt="Bioluminescent jellyfish" 
              />
              
              {/* Overlays and text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10 bg-black bg-opacity-10">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-2">GraphiCraft</h2>
                  <p className="text-xl text-gray-300">Design without limits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}