import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Head from 'next/head';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);
  const { sendPasswordResetLink, loading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStatusMessage({ type: '', message: '' });
    clearError();
    
    try {
      await sendPasswordResetLink(email);
      setIsSuccess(true);
      setStatusMessage({
        type: 'success',
        message: 'Password reset link has been sent to your email'
      });
    } catch (err: any) {
      setIsSuccess(false);
      setStatusMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send reset link. Please try again.'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | GraphiCraft</title>
        <meta name="description" content="Reset your GraphiCraft account password" />
      </Head>

      <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="w-full max-w-7xl flex flex-col md:flex-row max-h-7xl md:rounded-xl md:shadow-2xl overflow-hidden">
          {/* Form Section */}
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
                <h1 className="text-3xl font-bold mb-2">Forgot your password?</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {statusMessage.message && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  statusMessage.type === 'error' 
                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-red-600 dark:text-red-400' 
                    : statusMessage.type === 'success'
                      ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-green-600 dark:text-green-400'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-yellow-600 dark:text-yellow-400'
                }`}>
                  <div className="flex items-start">
                    {statusMessage.type === 'error' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    )}
                    {statusMessage.type === 'success' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className="text-sm">{statusMessage.message}</p>
                  </div>
                </div>
              )}

              {!isSuccess && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm text-gray-500 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                      placeholder=""
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 rounded-none text-center transition-colors ${
                      loading
                        ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending link...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              )}

              <div className="text-center mt-8">
                <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Back to login
                </Link>
              </div>
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