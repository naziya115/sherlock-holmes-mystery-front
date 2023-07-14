'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Chat from "./chat";

const fetchStory = async () => {
  if (typeof window === "undefined") {
    return {}
  }
  if (localStorage.getItem("story_id") != null) {
    console.log("story_id", localStorage.getItem("story_id"))
    console.log("token", localStorage.getItem("token"))
    try {
      const response = await axios.get(`http://localhost:8000/stories/${localStorage.getItem("story_id")}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token'),
          "accept": 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching story:", error);
      return {};
    }
  } else {
    const story = {
      story: {
        content: "Real-time story generation"
      }
    };
    return story;
  }
};

const StoryGenPage = () => {
  const [storyInfo, setStoryInfo] = useState(<></>);

  const fetchAndUpdateStory = async () => {
    const story = await fetchStory();
    if (story && story.story) {
      setStoryInfo(
        <>
          <div className="flex flex-column w-full h-[90vh] overflow-auto">
            <div className="flex inset-y-0 left-0 basis-1/2"><Chat /></div>
            <div className="flex inset-y-0 right-0 basis-1/2 p-8 text-black text-lg antialiased">
              {story.story.content}
            </div>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    fetchAndUpdateStory();
    const intervalId = setInterval(fetchAndUpdateStory, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return storyInfo;
}

export default StoryGenPage;
