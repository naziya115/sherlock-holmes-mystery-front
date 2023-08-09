import { throttle } from '@/lib/throttle'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import cx from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { ChatLine, LoadingChatLine } from './chat-line'

  export const initialMessages = [
    {
      role: 'assistant',
      content: "You're playing the role of Dr. Watson.\n In the chat you will be interacting with Sherlock Holmes. \n Follow the instructions. \n Let the game begin."
    },
  ]

  const Request = async ({ route, sherlock_message = "", type = "small_talk", method = "POST" }) => {
    const story_id = localStorage.getItem("story_id");
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: method,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    };
    if (method === "POST") {
      requestOptions.body = JSON.stringify({ story_id: story_id, sherlock_message: sherlock_message, type: type });
    }
    const response = await fetch('https://fastapi-lgg5.onrender.com/stories/' + route, requestOptions);
    return response;
  }
  

  const InputMessage = ({ input, setInput, sendMessage, loading, setSherlockSolution, setIsGenerating}) => {
    const inputRef = useRef(null)
    const [isStoryStageButton, setStoryStageButtonVisible] = useState(true);
    const [isInputMessageVisible, setInputMessageVisible] = useState(false);
    const [isMainSuspectsVisible, setMainSuspectsVisible] = useState(false);
    const [mainSuspects, setMainSuspects] = useState([]);
    const [storyStageButtonContent, setStoryStageButtonContent] = useState('Set the Setting');
    const[finishedStory, setFinishedStory] = useState(false);

    const shouldShowLoadingIcon = loading 
    const inputActive = input !== '' && !shouldShowLoadingIcon
    const storyId = localStorage.getItem('story_id');

    useEffect(() => {
      if (storyId == null) {
        setStoryStageButtonContent("Set the Setting");
        setInputMessageVisible(false);
      } else {
        if (finishedStory === false) {
          setStoryStageButtonVisible(true);
          setStoryStageButtonContent("Start the Case");
          setInputMessageVisible(true);
        } else {
          setStoryStageButtonVisible(true);
          setStoryStageButtonContent("Finish the Case");
        }
      }
    }, [storyId, finishedStory]);
    
    const StoryStage = () => {
      const storyId = localStorage.getItem('story_id');
      if (storyId == null) {
        SetStory();
        setStoryStageButtonVisible(false);
      } else if (finishedStory === true) {
        setInputMessageVisible(false);
        FinishStory();
        setStoryStageButtonVisible(false);
      } else {
        StartCase();
        sendMessage("My dear Watson, who do you think is the criminal?", true);
        setInputMessageVisible(false);
        setStoryStageButtonVisible(false);
      }
    };
  
    // finish the story
    const FinishStory = async() => {
      try {
        // set loading while generating
        setIsGenerating(true);
        const response = await Request({ route: "conclusion"});
        if (!response.ok)
          throw new Error('Failed to fetch data');
      }catch (error) {
        console.log(error);
      }
    };

    // set the setting of the story
    const SetStory = async () => {
      try {
        // set loading while generating
        setIsGenerating(true);

        const response = await Request({ route: "setting" });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const responseData = await response.json();
        const { _id } = responseData;
        localStorage.setItem('story_id', _id);
      } catch (error) {
        console.log(error);
      }
    };

    // start the case
    const StartCase = async () => {
      try {
        // set loading while generating
        setIsGenerating(true);
        const response = await Request({ route: "case_intro" });
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
      } catch (err) {
        console.error('Failed to fetch story content', err);
      }
      // get the main suspects, right after the victim's story is generated
      getMainSuspects();
    };

    const getMainSuspects = async() => {
      try {
        // set loading while generating
        setIsGenerating(true);
        const response = await Request({ route: "main_suspects", method: "GET"});
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
        const responseData = await response.json();
        const { sherlock_message } = responseData;
        const suspects = sherlock_message.split(',');
        setMainSuspects(suspects);
        setMainSuspectsVisible(true);
        setStoryStageButtonVisible(false);
        setInputMessageVisible(true);
        
      } catch (err) {
        console.error('Failed to fetch story content', err);
      }
    }
    
    useEffect(() => {
      const input = inputRef?.current
      if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }, [inputRef])

    const handleMainSuspectsButton = (name) => {
      // interaction when the user chooses the criminal
      setMainSuspectsVisible(false); 
      sendMessage(name, false, false)
      getInvestigation();
    };

    const getInvestigation = async() =>{
      try {
        // set loading while generating
        setIsGenerating(true);
        const response = await Request({ route: "investigation" });
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
        getSherlockSolution();
      } catch (err) {
        console.error('Failed to fetch story content', err);
      }
    }

    const getSherlockSolution = async() => {
      try {
        // set loading while generating
        setIsGenerating(true);
        const response = await Request({ route: "solution" });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const responseData = await response.json();
        const { sherlock_message } = responseData;
        setSherlockSolution(sherlock_message)
        setFinishedStory(true);
      } catch (err) {
        console.log(err)
      }
    };

    return (
      <div className="bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-white to-white flex flex-col items-center clear-both">

      {/* set Main Suspects of the case */}
      {isMainSuspectsVisible && (
        <div id="buttonsContainer" className="flex flex-col items-center">
          <p className="mb-6 mt-8">Choose one of the three options:</p>
          {mainSuspects.map((name, index) => (
            <div key={index}>
              <button onClick={() => handleMainSuspectsButton(name)} className="inline-flex rounded-md items-center justify-center mb-4">
                <span className="h-10 flex items-center justify-center uppercase font-semibold px-8 bg-gray-300 text-gray-800 rounded-md border border-black hover:bg-black hover:text-white transition duration-500 ease-in-out p-2">
                  {name}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      
      {isStoryStageButton && (
        <button onClick={StoryStage} className="inline-flex rounded-md items-center justify-center">
          <span className="h-10 flex items-center justify-center uppercase font-semibold px-8 bg-gray-300 text-gray-800 rounded-md border border-black hover:bg-black hover:text-white transition duration-500 ease-in-out">
            {storyStageButtonContent}
          </span>
        </button>
      )}
        
        {isInputMessageVisible && (
        <div className="mx-2 my-4 flex-1 w-full md:mx-4 md:mb-[52px] lg:max-w-2xl xl:max-w-3xl">
          <div className="relative mx-2 flex-1 flex-col rounded-md border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
            <input
              ref={inputRef}
              aria-label="chat input"
              required
              className="m-0 w-full border-0 text-sm bg-transparent p-0 py-3 pl-4 pr-12 text-black"
              placeholder="Type a message..."
              value={input}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(input)
                  setInput('')
                }
              }}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
            <button
              className={cx(
                shouldShowLoadingIcon && "hover:bg-inherit hover:text-inhert",
                inputActive && "bg-black hover:bg-neutral-800 hover:text-neutral-100",
                "absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 transition-colors")}
              type="submit"
              onClick={() => {
                sendMessage(input)
                setInput('')
              }}
              disabled={shouldShowLoadingIcon}
            >
              {shouldShowLoadingIcon
                ? <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
                : <div className={cx(inputActive && "text-white", "w-6 h-6")}>
                  <PaperAirplaneIcon />
                </div>
              }
            </button>
          </div>
        </div>
        )}
      </div>
    )
  }

    const useMessages = () => {
      const [messages, setMessages] = useState(initialMessages);
      const [isMessageStreaming, setIsMessageStreaming] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [solutionChat, setSolutionChat] = useState(false);

      const sendMessage = async (newMessage, isAssistant=false, answerRequired=true) => {
        setLoading(true);
        setError(null);
        if (isAssistant){
          const newMessages = [
            ...messages,
            { role: 'assistant', content: newMessage },
          ];
          setMessages(newMessages);
          setSolutionChat(true);
        }else if(!answerRequired){
          const newMessages = [
            ...messages,
            { role: 'user', content: newMessage },
          ];
          setMessages(newMessages);
        }
        else{
          const newMessages = [
            ...messages,
            { role: 'user', content: newMessage },
          ];
          setMessages(newMessages);
          // to fetch the message of the user and get response
          const answer = await fetchChatData(newMessage, solutionChat);
          setMessages([
            ...newMessages,
            { role: 'assistant', content: answer },
          ]);
          setLoading(false);
          setIsMessageStreaming(false);
        };
    }
      return {
        messages,
        isMessageStreaming,
        loading,
        error,
        sendMessage,
      };
    };

    const fetchChatData = async (newMessage, solutionChat) => {
      try {
        const storyId = localStorage.getItem("story_id");
        if (storyId != null) {
          const type = solutionChat ? "case_explanation" : "small_talk";
          const response = await Request({ route: "chat", sherlock_message: newMessage, type: type });
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const responseData = await response.json();
          const { sherlock_message } = responseData;
          return sherlock_message;
        }
        
      } catch (err) {
        console.log('Failed to fetch data');
      }
    };
    

  export default function Chat({setIsGenerating}) {
    const [input, setInput] = useState('')
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const { messages, isMessageStreaming, loading, error, sendMessage} = useMessages()
    const [sherlockSolution, setSherlockSolution] = useState(null)

    // check if IsGenerating is true
    useEffect(() => {
    }, [setIsGenerating]);

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const bottomTolerance = 30;

        if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
          setAutoScrollEnabled(false);
        } else {
          setAutoScrollEnabled(true);
        }
      }
    };

    const scrollDown = useCallback(() => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true)
      }
    }, [autoScrollEnabled])
    const throttledScrollDown = throttle(scrollDown, 250);

    useEffect(() => {
      throttledScrollDown()
    }, [messages, throttledScrollDown]);

    useEffect(() => {
      if (error) {
        toast.error(error)
      }
    }, [error])

    useEffect(() => {
      if(sherlockSolution != null){
        sendMessage(sherlockSolution, true);
        setSherlockSolution(null);
      }
    }, [sherlockSolution]);


    return (
      <div className="flex flex-col flex-1 w-full border-zinc-100 bg-white overflow-hidden h-[1/2]">
        <div
          ref={chatContainerRef}
          className="flex-1 w-full relative max-h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-scroll "
          onScroll={handleScroll}
        >
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} isStreaming={index === messages.length - 1 && isMessageStreaming} />
          ))}
          {loading && <LoadingChatLine />}
          <div
            className="h-[20vh]"
            ref={messagesEndRef}
          />
        </div>
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading || isMessageStreaming}
          setSherlockSolution={setSherlockSolution}
          setIsGenerating={setIsGenerating}
        />
        <Toaster />
      </div>
    )
  }