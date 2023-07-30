'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Chat from './chat';

// update the real-time generation with the story content
const fetchStory = async () => {
  if (localStorage.getItem("story_id") != null) {
    console.log("fetch story")
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
  const [storyInfo, setStoryInfo] = useState("* Real-time story generation (if it does't work, just imagine) *");
  const [isPhone, setIsPhone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() =>{
    console.log(isGenerating)
      if(isGenerating)
        setIsGenerating(true);
  }, [isGenerating]);

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

  // check for smaller screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)'); 
    setIsPhone(mediaQuery.matches);

    const handleResize = (event) => {
      setIsPhone(event.matches);
    };
    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  return (
    <>
      {!isPhone ? (
        <div className="flex flex-column w-full h-[90vh] overflow-auto">
          <div className="flex inset-y-0 left-0 basis-2/5"><Chat setIsGenerating={setIsGenerating} /></div>
          <div className="flex inset-y-0 right-0 basis-3/5 p-8 text-black text-base antialiased animate-typing pr-16 break-normal">
            <div className="story-container relative flex flex-col">
                <>
                  {storyInfo && (
                    <StreamText content={removeNumbersAndParentheses(storyInfo)} setIsGenerating={setIsGenerating}/>
                  )}
                  {isGenerating && (
                    <div className="generating-text mt-auto relative flex items-center">
                      <span className="text-base mr-2">generating...</span>
                      <img
                        className="max-w-12 h-12 right-0"
                        src="sherlock-holmes-animated.gif"
                        alt="Generating Sherlock Holmes GIF"
                      />
                    </div>
                  )} 
                </>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col h-screen">
            <div className='overflow-auto h-1/2'><Chat /></div>
            <div className='overflow-auto h-1/2 bg-white p-4'>
                <>
                  {storyInfo && (
                    <StreamText content={removeNumbersAndParentheses(storyInfo)} setIsGenerating={setIsGenerating}/>
                  )}
                   {isGenerating && (<span className="generating-text mt-auto">generating...</span> )}
                </>
            </div>
          </div>
        </>
      )}
    </>
  );
  
};

// stream story content
const StreamText = ({ content, setIsGenerating}) => {
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
        // buggy stuff 
        currentContent = content.slice(0, endIndex).replace(/\n\n/g, '<br />');

        setDisplayedContent(currentContent);
        setLastStreamedIndex(chunk);

        if (endIndex === content.length) {
          setShowCursor(true);
          console.log("finished")
          if(content != "* Real-time story generation (if it does't work, just imagine) *")
            setIsGenerating(false);
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
