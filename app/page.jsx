"use client"
import StoryGenPage from '@/components/home/StoryGenPage';
import Landing from '@/components/home/landing';
import { useEffect, useState } from 'react';

const Home = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log(token)
    setToken(storedToken);
  }, []);

  if (token) {
    return <StoryGenPage />;
  } else {
    return <Landing />;
  }
};

export default Home;


