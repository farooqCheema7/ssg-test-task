import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage or any other default path
    router.replace('/');
  }, [router]);

  return null;
};

export default Custom404;
