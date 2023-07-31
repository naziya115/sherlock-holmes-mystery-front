'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const fetchStory = async (id) => {
  if (typeof window === "undefined") {
    return {}
  }
  const response = await axios.get(`https://fastapi-lgg5.onrender.com/stories/${id}`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('token'),
      "accept": 'application/json',
    },
  });
  return response.data;
};

const Story = () => {
  const params = useParams();
  const id = params.id;
  const [storyInfo, setStoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const story = await fetchStory(id);
      let updatedContent = story.story.content.replaceAll("%", "<br>").replaceAll(/\n+/g, "<br>").replaceAll("$", "<br>").replace(/(<br\s*\/?>)\1+/g, "$1");



      setStoryInfo(
        <div className="px-4 lg:w-[80%] md:px-8 lg:px-16 xl:px-20">
          <h1 className="text-2xl text-center my-8">{story.story.title}</h1>
          <div className="px-2 md:px-4 lg:px-8 xl:px-12 2xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 text-base md:text-lg lg:text-base" dangerouslySetInnerHTML={{ __html: updatedContent }}></div>
        </div>
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return storyInfo;
};

export default Story;
