'use client'
import axios from 'axios';
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';



const Stories = () => {
  const [stories, setStories] = useState(null)
  const didFetchRef = useRef(false)


  useEffect(() => {
    if(didFetchRef.current == false){
      didFetchRef.current = true
      fetchStories()
      print(stories)
    }
  }, [stories])
  

  const fetchStories = async () => {
    let path = "/"
    const res = await axios.get("http://localhost:8000/stories/", {
      method: 'GET',
      headers: { "accept": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDllYTQ3NjgyZjYwZDc5NTc3MzFhYjYiLCJleHAiOjE2ODk2OTc0NTh9.mWksmWwzJZ8Ffu386atFnZDJ2KkKmHUOzuu03JkFAT8"},
    })
    const stories_inp = await res.data.stories
    setStories(stories_inp)
    console.log("stories:", stories_inp)
  }

  if (!stories) {
    return <div>Loading...</div>;
  }

  return (
  <div className="flex flex-col items-center">
    {
      stories.map((story) => (
        <Link href={`/stories/${story._id}`} key={story._id}>
          <div className="flex flex-col items-center mb-4">
            <div className="w-full max-w-screen-xl p-6 bg-[#F9F9F9] border border-gray-200 rounded-lg shadow hover:bg-[#F7F7F7]">
              <h5 className="font-semibold mb-2 text-2xl text-black">{story.title}</h5>
              <p className="mb-2 text-lg text-black">{story.content.substring(0, 50)}</p>
            </div>
          </div>
        </Link>
      ))
    }
    
  </div>

  )
}

export default Stories