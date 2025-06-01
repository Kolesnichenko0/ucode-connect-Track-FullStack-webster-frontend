import { useState, useEffect, useRef } from 'react';
import { useAuth, DEFAULT_AVATAR_URL } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Camera, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type TabType = 'profile' | 'account';

const ProfileContent = ({ user }) => {
    const { error, updateUserProfile, uploadUserAvatar, avatarObjectUrl, loadUserAvatar, deleteAvatar, loading, deleteAccount } = useAuth();
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState<TabType>(router.query.tab as TabType || 'profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || null,
        email: user?.email || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState('');

    const REQUIRED_CONFIRMATION_PHRASE = 'delete my account';

    const DEFAULT_AVATAR_URL = 'http://localhost:8080/assets/images/user-avatars/default-avatar.png';

    useEffect(() => {
        if (user?.avatarFileURL && user.avatarFileURL !== DEFAULT_AVATAR_URL && !avatarPreview) {
            loadUserAvatar(user.avatarFileURL);
        }
        return () => {
            if (avatarObjectUrl) {
                URL.revokeObjectURL(avatarObjectUrl);
            }
        };
    }, [user?.avatarFileURL, avatarPreview]);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
        }
    }, [user]);

    useEffect(() => {
        if (router.query.tab && (router.query.tab === 'profile' || router.query.tab === 'account')) {
            setActiveSection(router.query.tab as TabType);
        }
    }, [router.query.tab]);

    const handleSectionChange = (section: TabType) => {
        setActiveSection(section);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: section },
        }, undefined, { shallow: true });
        setIsMobileMenuOpen(false);
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            const dataToSend = {
                firstName: profileData.firstName,
                lastName: profileData.lastName === '' ? null : profileData.lastName,
            };

            const response = await updateUserProfile(dataToSend);

            if (response.error) {
                toast.error(response.message, {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
            } else {
                toast.success(response.message || 'Profile successfully updated', {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Unable to update profile. Please try again.', {
                style: {
                    background: isDarkMode ? '#000000' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                },
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            handleAvatarUpload(file);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('avatar', file);

            const userId = user?.id;
            if (userId) {
                const response = await uploadUserAvatar(formData, userId);

                if (response.error) {
                    toast.error(response.message, {
                        style: {
                            background: isDarkMode ? '#000000' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        },
                    });
                    setAvatarPreview(null);
                } else {
                    toast.success('Avatar successfully updated', {
                        style: {
                            background: isDarkMode ? '#000000' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        },
                    });
                    if (response.avatarFileURL) {
                        loadUserAvatar(response.avatarFileURL);
                    }
                }
            } else {
                toast.error('User not authenticated', {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Unable to upload avatar. Please try again.', {
                style: {
                    background: isDarkMode ? '#000000' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                },
            });
            setAvatarPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user || !user.avatarFileURL || user.avatarFileURL === DEFAULT_AVATAR_URL) {
            return;
        }

        try {
            const response = await deleteAvatar();

            if (response.error) {
                toast.error(response.message, {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
            } else {
                toast.success(response.message || 'Avatar successfully deleted', {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error('Error deleting avatar:', error);
            toast.error('Unable to delete avatar. Please try again.', {
                style: {
                    background: isDarkMode ? '#000000' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                },
            });
        }
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName ? firstName.charAt(0) : '';
        const last = lastName ? lastName.charAt(0) : '';
        return (first + last).toUpperCase();
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleDeleteAccountClick = () => {
        setShowPasswordConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowPasswordConfirm(false);
        setConfirmationInput('');
    };

    const handleConfirmDelete = async () => {
        if (confirmationInput !== REQUIRED_CONFIRMATION_PHRASE) {
            console.error('Confirmation phrase mismatch');
            return;
        }

        if (!user) return;

        try {
            const response = await deleteAccount(confirmationInput);

            if (response.error) {
                toast.error(response.message, {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
                setConfirmationInput('');
            } else {
                toast.success(response.message || 'Account successfully deleted', {
                    style: {
                        background: isDarkMode ? '#000000' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    },
                });
            }
        } catch (error) {
            console.error('Unexpected error during account deletion confirmation:', error);
            toast.error('An unexpected error occurred during deletion. Please try again.', {
                style: {
                    background: isDarkMode ? '#000000' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                },
            });
            setConfirmationInput('');
        }
    };

    return (
        <>
            <Head>
                <title>Your Profile | GraphiCraft</title>
                <meta name="description" content="Manage your GraphiCraft profile" />
            </Head>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                theme={isDarkMode ? 'dark' : 'light'}
                className="graphicraft-toast"
            />

            <div className="h-[800px] bg-white dark:bg-black flex overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
                    {/* User Info */}
                    <div className="py-12 p-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col items-center">
                            <div className="relative group mb-3">
                                {(user?.avatarFileURL && user.avatarFileURL !== DEFAULT_AVATAR_URL && !loading) && (
                                    <button
                                        onClick={handleDeleteAvatar}
                                        disabled={loading || isUploading}
                                        className="absolute top-0 right-0 bg-red-600 dark:bg-red-800 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 transform group-hover:scale-110 opacity-0 group-hover:opacity-100"
                                        aria-label="Delete avatar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                                    {(avatarPreview || avatarObjectUrl || user?.avatarFileURL || true) ? (
                                        <img
                                            src={avatarPreview || avatarObjectUrl || user?.avatarFileURL || DEFAULT_AVATAR_URL}
                                            alt={`${user?.firstName} ${user?.lastName}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            <span className="text-lg font-medium">{getInitials(user?.firstName, user?.lastName)}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleAvatarButtonClick}
                                    disabled={isUploading}
                                    className="absolute bottom-0 right-0 bg-black dark:bg-white text-white dark:text-black rounded-full p-1.5 shadow-lg transition-all duration-200 transform group-hover:scale-110"
                                >
                                    {isUploading ? (
                                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <Camera size={16} />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={loading || isUploading}
                                />
                            </div>
                            <h2 className="text-lg font-bold text-black dark:text-white">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-2">
                            <button
                                onClick={() => handleSectionChange('profile')}
                                className={`w-full px-3 py-2 rounded-lg flex items-center transition-colors ${activeSection === 'profile' ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Profile Settings
                            </button>
                            <button
                                onClick={() => handleSectionChange('account')}
                                className={`w-full px-3 py-2 rounded-lg flex items-center transition-colors ${activeSection === 'account' ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                Account Management
                            </button>
                        </div>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-black z-10 shadow-sm border-b border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center p-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-8 w-8">
                                <div className="absolute top-0 left-0 h-8 w-8 bg-black dark:bg-white rounded-lg transform rotate-45 opacity-80"></div>
                                <div className="absolute top-0 left-0 h-8 w-8 bg-white dark:bg-black rounded-lg transform rotate-12 opacity-80"></div>
                                <div className="absolute top-0 left-0 h-8 w-8 bg-gray-800 dark:bg-gray-200 rounded-lg opacity-80"></div>
                            </div>
                            <span className="text-lg font-bold text-black dark:text-white">
                                GraphiCraft
                            </span>
                        </Link>

                        <div className="flex items-center">
                            <div className="mr-2 text-right">
                                <h2 className="text-sm font-semibold text-black dark:text-white">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Profile</p>
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-1 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                            >
                                {isMobileMenuOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                            <div className="p-4 flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                                        {(avatarPreview || avatarObjectUrl) ? (
                                            <img
                                                src={avatarPreview || avatarObjectUrl || DEFAULT_AVATAR_URL}
                                                alt={`${user?.firstName} ${user?.lastName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                <span className="text-sm font-medium">{getInitials(user?.firstName, user?.lastName)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="font-medium text-black dark:text-white">{user?.firstName} {user?.lastName}</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-50 dark:bg-black">
                    <div className="md:p-10 p-4 md:pt-10 pt-20">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Your Profile
                            </h1>
                            <p className="text-gray-600 dark:text-gray-200">
                                Update your profile information and settings
                            </p>
                        </header>

                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <div className="space-y-8">
                                <div className="bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="h-8 inline-flex items-center px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-800 dark:hover:bg-gray-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                </svg>
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        if (user) {
                                                            setProfileData({
                                                                firstName: user.firstName || '',
                                                                lastName: user.lastName || '',
                                                                email: user.email || '',
                                                            });
                                                        }
                                                        setIsEditing(false);
                                                    }}
                                                    className="h-8 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                    className="h-8 inline-flex items-center px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Saving
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                                <polyline points="7 3 7 8 15 8"></polyline>
                                                            </svg>
                                                            Save
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                                                    First Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        value={profileData.firstName}
                                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white transition-colors dark:bg-gray-900"
                                                        placeholder="Enter your first name"
                                                    />
                                                ) : (
                                                    <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 h-12">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="12" cy="7" r="4"></circle>
                                                        </svg>
                                                        <p className="text-gray-900 dark:text-white flex-1">{profileData.firstName}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                                                    Last Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        id="lastName"
                                                        name="lastName"
                                                        value={profileData.lastName}
                                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-white transition-colors dark:bg-gray-900"
                                                        placeholder="Enter your last name"
                                                    />
                                                ) : (
                                                    <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 h-12">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="12" cy="7" r="4"></circle>
                                                        </svg>
                                                        <p className="text-gray-900 dark:text-white flex-1">{profileData.lastName}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                                                    Email Address
                                                </label>
                                                <div className="flex h-12 items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                        <polyline points="22,6 12,13 2,6"></polyline>
                                                    </svg>
                                                    <p className="text-gray-900 dark:text-white flex-1">{profileData.email}</p>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">Cannot be changed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Management Section */}
                        {activeSection === 'account' && (
                            <div className="space-y-8">
                                <div className="bg-red-50 dark:bg-red-950 rounded-2xl shadow-sm border border-red-200 dark:border-red-800 overflow-hidden">
                                    <div className="flex justify-between items-center px-6 py-5 bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-800">
                                        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Account Management</h2>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h3>
                                            <p className="text-red-700 dark:text-red-300">Deleting your account is a permanent action. All your data, including projects and settings, will be removed and cannot be recovered.</p>
                                        </div>

                                        <button
                                            onClick={handleDeleteAccountClick}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                        >
                                            Delete My Account
                                        </button>

                                        {showPasswordConfirm && (
                                            <div className="mt-6 p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-100 dark:bg-red-900 space-y-4">
                                                <p className="text-red-800 dark:text-red-200 font-medium">Are you absolutely sure? This action cannot be undone.</p>
                                                <div>
                                                    <p className="text-red-800 dark:text-red-200 text-sm mb-1.5">Please enter <strong>'{REQUIRED_CONFIRMATION_PHRASE}'</strong> to confirm.</p>
                                                    <label htmlFor="confirmationInput" className="sr-only">Enter confirmation phrase</label>
                                                    <input
                                                        type="text"
                                                        id="confirmationInput"
                                                        name="confirmationInput"
                                                        className="w-full px-4 py-2.5 rounded-lg border border-red-300 dark:border-red-600 dark:text-white transition-colors dark:bg-red-800 text-sm"
                                                        placeholder={`Enter a special phrase`}
                                                        value={confirmationInput}
                                                        onChange={(e) => setConfirmationInput(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={handleConfirmDelete}
                                                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={confirmationInput !== REQUIRED_CONFIRMATION_PHRASE || loading}
                                                    >
                                                        {loading ? 'Deleting...' : 'I understand, delete my account'}
                                                    </button>
                                                    <button
                                                        onClick={handleCancelDelete}
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 font-medium rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileContent;