'use client'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Stories = () => {
  const [stories, setStories] = useState(null);
  const didFetchRef = useRef(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchStories();
    }
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get('https://fastapi-lgg5.onrender.com/stories/', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });

      const stories_inp = res.data.stories;
      setStories(stories_inp);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <img width={40} src="/no-stories.png" alt="No stories" />
        <div>No stories found.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl items-center text-center mb-10">My generated stories</h1>
      {stories.map((story) => (
        <Link href={`/stories/${story._id}`} key={story._id}>
          <div className="flex flex-col items-center mb-4">
            <div className="w-full max-w-screen-xl p-6 bg-[#F9F9F9] border border-gray-200 rounded-lg shadow hover:bg-[#F7F7F7]">
              <h5 className="font-semibold mb-2 text-2xl text-black">{story.title}</h5>
              <p className="mb-2 text-lg text-black">{story.content.substring(0, 50)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Stories;
