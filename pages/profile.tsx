import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProfileContent = dynamic(
  () => import('../components/ProfileContent'),
  {
    ssr: false,
  }
);

export default function Profile() {
  const router = useRouter();
  const { user, loading, initialLoading } = useAuth();
  
  useEffect(() => {
  }, []);
  
  useEffect(() => {
    if (!initialLoading && !user) {
      const returnUrl = router.asPath;
      sessionStorage.setItem('returnUrl', returnUrl);
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [initialLoading, user, router]);

  if (initialLoading) {
    return (
      <>
        <Head>
          <title>Loading Profile | GraphiCraft</title>
        </Head>
        <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Your Profile | GraphiCraft</title>
        <meta name="description" content="Manage your GraphiCraft profile" />
      </Head>

      <ProfileContent user={user} />
    </>
  );
}
