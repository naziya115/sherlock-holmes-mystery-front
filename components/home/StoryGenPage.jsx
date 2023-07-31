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
  }
};

// display only the latest part of the story
  function getSubstringAfterLastMod(inputString) {
    const lastIndex = inputString.lastIndexOf("%");

    if (lastIndex !== -1) {
      if(!inputString.slice(lastIndex + 1).includes("$"))
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
      if(isGenerating){
        const fetchAndUpdateStory = async () => {
          const story = await fetchStory();
          if (story && story.story) {
            const storyContent = getSubstringAfterLastMod(story.story.content);
            if(storyContent != storyInfo){
              setStoryInfo("");
              setStoryInfo(storyContent);   
            }
          }
        };
    
        const intervalId = setInterval(fetchAndUpdateStory, 5000);
        fetchAndUpdateStory();
        return () => clearInterval(intervalId);
    }
  }, [isGenerating]);

  useEffect(() => {
    // start a new story after the page is reloaded
    localStorage.removeItem("story_id");
    localStorage.removeItem("next_question");
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
          <div className="flex inset-y-0 left-0 basis-2/5"><Chat setIsGenerating={setIsGenerating}/></div>
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
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const chunkSize  = 50;
  let speed = 200;

  useEffect(() => {
    let interval;
    const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];

    if (currentChunkIndex < chunks.length) {
      interval = setInterval(() => {
        setCurrentChunkIndex((prevIndex) => prevIndex + 1);
      }, speed);
    }else{
      setIsGenerating(false);
    }

    return () => clearInterval(interval);
  }, [currentChunkIndex, content, chunkSize, speed]);

  useEffect(() => {
    const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
    const currentChunk = chunks.slice(0, currentChunkIndex + 1).join('');
    setDisplayedContent(currentChunk.replace(/\n\n/g, '<br />'));
  }, [currentChunkIndex, content, chunkSize]);

  return (
    <span>
      <div style={{ display: 'inline' }} dangerouslySetInnerHTML={{ __html: displayedContent }} />
      <span style={{ display: 'inline', opacity: 0.7 }}>|</span>
    </span>
  );
};

export default StoryGenPage;
