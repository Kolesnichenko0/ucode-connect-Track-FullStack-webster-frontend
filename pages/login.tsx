import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, error: authError, loading, user, clearError } = useAuth();
  const router = useRouter();
  const { returnUrl } = router.query;
  const error = localError || authError;

  // Check if user was redirected after registration
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  
  useEffect(() => {
    if (router.query.registered === 'true') {
      setShowRegistrationSuccess(true);
      // Hide the message after 6 seconds
      const timer = setTimeout(() => {
        setShowRegistrationSuccess(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  useEffect(() => {
    if (authError) {
      clearError();
    }
    
    if (user) {
      if (returnUrl && typeof returnUrl === 'string') {
        router.push(decodeURIComponent(returnUrl));
      } else {
        const savedReturnUrl = sessionStorage.getItem('returnUrl');
        if (savedReturnUrl) {
          sessionStorage.removeItem('returnUrl');
          router.push(savedReturnUrl);
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, router, returnUrl, authError, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLocalError('');
    clearError();
    
    try {
      const response = await login(email, password);
      if (response && response.error) {
        setLocalError(response.message || 'Failed to login');
        return;
      }
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.log('Login error handled:', err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | GraphiCraft</title>
        <meta name="description" content="Sign in to GraphiCraft to create beautiful designs" />
      </Head>

      <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
        <div className="w-full max-w-7xl flex flex-col md:flex-row max-h-7xl  md:rounded-xl md:shadow-2xl overflow-hidden">
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

              {showRegistrationSuccess && (
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">Registration successful! You can now sign in with your new account.</p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm text-gray-500 mb-1">
                      Email
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

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm text-gray-500 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-black dark:text-white focus:ring-0 border-gray-300 dark:border-gray-700 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </label>
                  </div>

                  <Link href="/forgot-password" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                    Forgot password?
                  </Link>
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-black dark:text-white hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Jellyfish Section */}
          <div className="w-full md:w-1/2 hidden md:block bg-black relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/images/jellyfish1.png" 
                alt="Bioluminescent jellyfish" 
                //className="w-full h-full object-cover opacity-100"
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