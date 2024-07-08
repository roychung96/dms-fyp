// lib/withAdminAuth.tsx

"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';

const withAdminAuth = (Component: any) => {
  console.log('withAdminAuth is being applied'); // Debug line
  return function WrappedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    console.log('withAdminAuth WrappedComponent rendering'); // Debug line

    useEffect(() => {
      if (!loading && (!user || !user.isAdmin)) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
};

export default withAdminAuth;
