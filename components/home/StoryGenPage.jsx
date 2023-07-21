
'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Chat from './chat';

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
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching story:", error);
      return {};
    }
  } else {
    const story = {
      story: {
        content: "* Real-time story generation (if it does't work, just imagine) *"
      }
    };
    return story;
  }
};

function removeNumbersAndParentheses(text) {
  const regex = /[0-9()]/g;
  return text.replace(regex, '');
}

const StoryGenPage = () => {
  const [storyInfo, setStoryInfo] = useState(null);

  useEffect(() => {
    // localStorage.removeItem("story_id");
    // localStorage.removeItem("next_question");

    const fetchAndUpdateStory = async () => {
      const story = await fetchStory();
      if (story && story.story) {
        setStoryInfo(story.story.content);
      }
    };

    const intervalId = setInterval(fetchAndUpdateStory, 5000);

    fetchAndUpdateStory();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <div className="flex flex-column w-full h-[90vh] overflow-auto">
      <div className="flex inset-y-0 left-0 basis-2/5"><Chat /></div>
      <div className="flex inset-y-0 right-0 basis-3/5 p-8 text-black text-lg antialiased animate-typing pr-16 break-normal">
      {storyInfo && (
            <StreamText content={removeNumbersAndParentheses(storyInfo)} />
          )}
      </div>
    </div>
    </>
  );
};

const StreamText = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [lastStreamedIndex, setLastStreamedIndex] = useState(0);

  // * text-to-speech generation *

  useEffect(() => {
    let currentContent = '';

    const displayStream = async () => {
      for (let i = lastStreamedIndex; i <= content.length; i++) {
        currentContent = content.slice(0, i);
        setDisplayedContent(currentContent);
        setLastStreamedIndex(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
 
    displayStream();
  }, [content, lastStreamedIndex]);

  return (
    <span>
      {displayedContent}
      <span className="blink-cursor">|</span>
    </span>
  );
};





export default StoryGenPage;
