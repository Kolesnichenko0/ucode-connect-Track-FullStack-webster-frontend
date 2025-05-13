import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, loading, error: contextError, user, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    clearError();
    
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number and special character');
    } else if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password && newConfirmPassword && password !== newConfirmPassword) {
      setPasswordError('Passwords do not match');
    } else if (password && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number and special character');
    } else {
      setPasswordError('');
    }
  };

  const handleApiError = (errorMessage) => {
    if (errorMessage.includes('email already') || errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
      setStatusMessage({
        type: 'error',
        message: 'This email is already registered. Please use a different email or try to login.'
      });
    } else if (errorMessage.includes('validation') || errorMessage.includes('valid email')) {
      setStatusMessage({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
    } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
      setStatusMessage({
        type: 'error',
        message: 'Network connection issue. Please check your internet connection and try again.'
      });
    } else {
      setStatusMessage({
        type: 'error',
        message: errorMessage || 'Registration failed. Please try again.'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: '', message: '' });
    
    if (!firstName || !lastName || !email || !password) {
      setStatusMessage({
        type: 'error',
        message: 'All fields are required'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number and special character');
      return;
    }
    
    try {
      const response = await register(firstName, lastName, email, password);

      if (response && response.error) {
        handleApiError(response.message || 'Registration failed');
        return; 
      }
      
      setRegistrationSuccess(true);
      setStatusMessage({
        type: 'success',
        message: 'Registration successful! Please check your email to verify your account.'
      });
      
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 5000);
      
    } catch (err: any) {
      console.error('Unexpected error in Register handleSubmit:', err);
      handleApiError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | GraphiCraft</title>
        <meta name="description" content="Create your GraphiCraft account and start designing" />
      </Head>

      <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
      <div className="w-full max-w-7xl flex flex-col md:flex-row max-h-7xl  md:rounded-xl md:shadow-2xl overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 md:p-12 h-[800px] flex items-center justify-center relative z-10 bg-white dark:bg-black">
            <div className="w-full max-w-md">
              {registrationSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We've sent a verification email to <span className="font-medium">{email}</span>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    You will be redirected to the login page in a few seconds...
                  </p>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Go to Login Page
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Join GraphiCraft to unlock your creative potential</p>
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label htmlFor="first-name" className="block text-sm text-gray-500 mb-1">
                          First name
                        </label>
                        <input
                          id="first-name"
                          name="first-name"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full h-10 px-3 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                          placeholder=""
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="last-name" className="block text-sm text-gray-500 mb-1">
                          Last name
                        </label>
                        <input
                          id="last-name"
                          name="last-name"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full h-10 px-3 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                          placeholder=""
                        />
                      </div>
                    </div>

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
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        We'll send a verification email to this address
                      </p>
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
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={handlePasswordChange}
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
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className={`flex items-center gap-1 ${password.length >= 8 ? 'text-black dark:text-white' : ''}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                          8+ characters
                        </span>
                        <span className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-black dark:text-white' : ''}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                          Uppercase
                        </span>
                        <span className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-black dark:text-white' : ''}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                          Lowercase
                        </span>
                        <span className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-black dark:text-white' : ''}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                          Number
                        </span>
                        <span className={`flex items-center gap-1 ${/[^\da-zA-Z]/.test(password) ? 'text-black dark:text-white' : ''}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
                          Special character
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <label htmlFor="confirm-password" className="block text-sm text-gray-500 mb-1">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          className="w-full h-10 px-3 pr-10 border-0 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white focus:outline-none"
                          placeholder=""
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
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

                    {passwordError && (
                      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !!passwordError}
                      className={`w-full h-12 rounded-none text-center transition-colors ${
                        loading || !!passwordError
                          ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-400 dark:text-gray-500'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        'Create account'
                      )}
                    </button>

                    <div className="text-center mt-8">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-black dark:text-white hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                      <p>By creating an account, you agree to our</p>
                      <div className="mt-1 space-x-1">
                        <a href="#" className="text-black dark:text-white hover:underline">Terms of Service</a>
                        <span>&middot;</span>
                        <a href="#" className="text-black dark:text-white hover:underline">Privacy Policy</a>
                      </div>
                    </div>
                  </form>
                </>
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