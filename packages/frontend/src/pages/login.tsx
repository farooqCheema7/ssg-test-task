// pages/Login.tsx
import { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Login from '../components/Login';

const LoginPage: NextPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // If loading authentication status, don't render the login page yet
  if (loading) {
    return null;
  }

  return <Login />;
};

export default LoginPage;
