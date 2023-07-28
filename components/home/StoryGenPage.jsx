'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Chat from './chat';

// update the real-time generation with the story content
const fetchStory = async () => {
  if (localStorage.getItem("story_id") != null) {
    try {
      const response = await axios.get(`https://fastapi-lgg5.onrender.com/stories/${localStorage.getItem("story_id")}`, {
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
        content: "* Real-time story generation (if it does't work, just imagine) *"
      }
    };
    return story;
  }
};

  // display only the latest part of the story
  function getSubstringAfterLastDollar(inputString) {
    const lastIndex = inputString.lastIndexOf("$");

    if (lastIndex !== -1) {
      return inputString.slice(lastIndex + 1);
    } else {
      return inputString;
    }
  }

// remove unnecessary symbols
function removeNumbersAndParentheses(text) {
  const regex = /[0-9()]/g;
  return text.replace(regex, '');
}

const StoryGenPage = () => {
  const [storyInfo, setStoryInfo] = useState(null);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    // start a new story after the page is reloaded
    localStorage.removeItem("story_id");
    localStorage.removeItem("next_question");

    const fetchAndUpdateStory = async () => {
      const story = await fetchStory();
      if (story && story.story) {
        const storyContent = getSubstringAfterLastDollar(story.story.content);
        setStoryInfo(storyContent);
      }
    };

    const intervalId = setInterval(fetchAndUpdateStory, 5000);

    fetchAndUpdateStory();

    return () => clearInterval(intervalId);
  }, []);

 // design for smaller screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // Adjust the max-width to the desired breakpoint for phones
    setIsPhone(mediaQuery.matches);

    const handleResize = (event) => {
      setIsPhone(event.matches);
    };

    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  return (
    // display story
    <>
    {!isPhone ? (
      <div className="flex flex-column w-full h-[90vh] overflow-auto">
        <div className="flex inset-y-0 left-0 basis-2/5"><Chat/></div>
        <div className="flex inset-y-0 right-0 basis-3/5 p-8 text-black text-base antialiased animate-typing pr-16 break-normal">
          {storyInfo && (
            <StreamText content={removeNumbersAndParentheses(storyInfo)} />
          )}
        </div>
      </div>
    ) : (
    <div className="flex flex-column w-full h-[90vh] overflow-auto" style={{ flexDirection: 'column' }}>
      <div className="inset-y-0 left-0">
        <Chat />
      </div>
    </div>
    )}

    </>
  );
};

// stream story content
const StreamText = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [lastStreamedIndex, setLastStreamedIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentContent = '';

    const displayStream = async () => {
      // divide story content into chunks to make steaming more efficient
      const chunkSize = 50; 
      const totalChunks = Math.ceil(content.length / chunkSize);

      for (let chunk = lastStreamedIndex; chunk < totalChunks; chunk++) {
        const startIndex = chunk * chunkSize;
        const endIndex = Math.min(startIndex + chunkSize, content.length);
        // evil
        currentContent = content.slice(0, endIndex).replace(/\n\n/g, '<br />');
        setDisplayedContent(currentContent);
        setLastStreamedIndex(chunk);

        if (endIndex === content.length) {
          setShowCursor(true);
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    displayStream();
  }, [content, lastStreamedIndex]);

  // move cursor as the story content is streamed
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prevShowCursor) => !prevShowCursor);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      <div style={{ display: 'inline' }} dangerouslySetInnerHTML={{ __html: displayedContent }} />
      {showCursor && <span style={{ display: 'inline', opacity: 0.7 }}>|</span>}
    </span>
  );
};

export default StoryGenPage;
