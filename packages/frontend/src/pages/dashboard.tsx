// pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <p>Loading...</p>; // Display loading indicator while checking auth status

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the main dashboard!</p>
    </div>
  );
};

export default Dashboard;
