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

  const InputMessage = ({ input, setInput, sendMessage, loading, setSherlockSolution}) => {
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
      if(storyId == null){
        setStoryStageButtonContent("Set the Setting");
        setInputMessageVisible(false);
      }
      else if (storyId != null && finishedStory == false) {
        setStoryStageButtonVisible(true);
        setStoryStageButtonContent("Start the Case");
        setInputMessageVisible(true);
      }else if(finishedStory == true && storyId != null){
        setStoryStageButtonVisible(true);
        setStoryStageButtonContent("Finish the Case");
      }
    }, [storyId, finishedStory == true])

    const StoryStage = () => {
      const storyId = localStorage.getItem('story_id');
      if(storyId == null){
        SetStory();
        setStoryStageButtonVisible(false);
      }else if(finishedStory == true){
        setInputMessageVisible(false);
        FinishStory();
        setStoryStageButtonVisible(false);
      }else{
        StartCase();
        sendMessage("Who is the criminal", true);
        setInputMessageVisible(false);
        setStoryStageButtonVisible(false);
      }
    }
    
    // finish the story
    const FinishStory = async() => {
      try {
        const response = await fetch('http://localhost:8000/stories/conclusion', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ story_id: localStorage.getItem('story_id')}),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
      }
    };

    // set the setting of the story
    const SetStory = async () => {
      try {
        const response = await fetch('http://localhost:8000/stories/setting', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const responseData = await response.json();
        const { _id } = responseData;
        localStorage.setItem('story_id', _id);
      } catch (error) {
      }
    };

    // start the case
    const StartCase = async () => {
      try {
        const response = await fetch('http://localhost:8000/stories/case_intro', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ story_id: localStorage.getItem('story_id')}),
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
      } catch (err) {
        console.error('Failed to fetch story content', err);
        toast.error('Failed to fetch story content');
      }
      // get the main suspects, right after the victim's story is generated
      getMainSuspects();
    };

    const getMainSuspects = async() => {
      try {
        const response = await fetch('http://localhost:8000/stories/main_suspects', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
    
        const responseData = await response.json();
        const { sherlock_message } = responseData;
        const suspects = sherlock_message.split('\n');
        
        setMainSuspects(suspects);
        setMainSuspectsVisible(true);
        setStoryStageButtonVisible(false);
        setInputMessageVisible(true);
        
      } catch (err) {
        console.error('Failed to fetch story content', err);
        toast.error('Failed to fetch story content');
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
      sendMessage(name)
      getInvestigation();
    };

    const getInvestigation = async() =>{
      try {
        const response = await fetch('http://localhost:8000/stories/investigation', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ story_id: localStorage.getItem('story_id')}),
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch story content');
        }
        getSherlockSolution();
      } catch (err) {
        console.error('Failed to fetch story content', err);
        toast.error('Failed to fetch story content');
      }
    }

    const getSherlockSolution = async() => {
      try {
        const response = await fetch('http://localhost:8000/stories/solution', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ story_id: localStorage.getItem('story_id')}),
        });
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
          {mainSuspects.map((name, index) => (
            <div key={index}>
              <button
                onClick={() => handleMainSuspectsButton(name)}
                className="bg-black text-white px-4 py-2 rounded-md mb-3"
              >
                {name}
              </button>
            </div>
          ))}
        </div>
      )}

      
      {isStoryStageButton && (
        <button
          className="inline-flex items-center rounded border border-neutral-200 bg-white py-2 pr-4 text-black text-sm hover:opacity-50 disabled:opacity-25"
          onClick={StoryStage}
        >
          <div className="w-4 h-4"></div> {storyStageButtonContent}
        </button>
      )}
        
        {isInputMessageVisible && (
        <div className="mx-2 my-4 flex-1 w-full md:mx-4 md:mb-[52px] lg:max-w-2xl xl:max-w-3xl">
          <div className="relative mx-2 flex-1 flex-col rounded-md border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] sm:mx-4">
            <input
              ref={inputRef}
              aria-label="chat input"
              required
              className="m-0 w-full border-0 bg-transparent p-0 py-3 pl-4 pr-12 text-black"
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

      const sendMessage = async (newMessage, isAssistant=false) => {
        setLoading(true);
        setError(null);
        if (isAssistant){
          const newMessages = [
            ...messages,
            { role: 'assistant', content: newMessage },
          ];
  
          setMessages(newMessages);
          setSolutionChat(true);
        }else{
          const newMessages = [
            ...messages,
            { role: 'user', content: newMessage },
          ];
          setMessages(newMessages);
        

        try {
          const storyId = localStorage.getItem("story_id");
          if (storyId != null && solutionChat == false) {
            console.log("small talk")
            const response = await fetch('http://localhost:8000/stories/chat', {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              body: JSON.stringify({ sherlock_message: newMessage, type: "small_talk"}),
            });
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            const { sherlock_message } = responseData;

            setMessages([
              ...newMessages,
              { role: 'assistant', content: sherlock_message },
            ]);

            setLoading(false);
            setIsMessageStreaming(false);
            
          }
          else if(storyId != null && solutionChat == true){
            console.log("explanation chat")
            const response = await fetch('http://localhost:8000/stories/chat', {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
              body: JSON.stringify({ sherlock_message: newMessage, type: "case_explanation"}),
            });
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();

            const { sherlock_message } = responseData;

            setMessages([
              ...newMessages,
              { role: 'assistant', content: sherlock_message },
            ]);

            setLoading(false);
            setIsMessageStreaming(false);
          }
        } catch (err) {
          setError('Failed to fetch data');
          setLoading(false);
          setIsMessageStreaming(false);
        }
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


  export default function Chat() {
    const [input, setInput] = useState('')
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const { messages, isMessageStreaming, loading, error, sendMessage} = useMessages()
    const [sherlockSolution, setSherlockSolution] = useState(null)


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
      <div className="flex flex-col flex-1 w-full border-zinc-100 bg-white overflow-hidden y-full">
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
            className="h-[54vh] bg-white"
            ref={messagesEndRef}
          />
        </div>
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading || isMessageStreaming}
          setSherlockSolution={setSherlockSolution}
          
        />
        <Toaster />
      </div>
    )
  }