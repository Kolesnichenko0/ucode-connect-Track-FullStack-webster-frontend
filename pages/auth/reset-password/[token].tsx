import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import Head from 'next/head';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const router = useRouter();
  const { token } = router.query;
  const { resetPassword, loading, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setMessage('');
    clearError();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    
    try {
      if (token && typeof token === 'string') {
        await resetPassword(token, password);
        setIsSuccess(true);
        setMessage('Your password has been successfully reset. You can now log in with your new password.');
      } else {
        setIsTokenValid(false);
        setMessage('Invalid reset token. Please request a new password reset link.');
      }
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Password reset failed. This link may be invalid or expired.');
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | GraphiCraft</title>
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
                <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
                {!isSuccess && isTokenValid && (
                  <p className="text-gray-500 dark:text-gray-400">Please enter a new password for your account.</p>
                )}
              </div>

              {message && (
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <p className={`text-sm ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {message}
                  </p>
                </div>
              )}

              {!isSuccess && isTokenValid && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm text-gray-500 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-10 px-3 pr-10 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                          placeholder=""
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                      </p>
                    </div>

                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm text-gray-500 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-10 px-3 pr-10 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                          placeholder=""
                        />
                      </div>
                    </div>
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
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              )}

              {isSuccess && (
                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="w-full h-12 rounded-none flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
              
              {(!isTokenValid || (!isSuccess && !isTokenValid)) && (
                <div className="text-center">
                  <Link 
                    href="/forgot-password" 
                    className="w-full h-12 rounded-none flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Request New Reset Link
                  </Link>
                </div>
              )}

              <div className="text-center mt-8">
                <Link 
                  href="/login" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
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