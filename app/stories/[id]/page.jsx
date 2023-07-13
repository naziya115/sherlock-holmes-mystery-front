'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';


import { useEffect, useState } from 'react';


const fetchStory = async (id) => {
  console.log("in")
  if (typeof window === "undefined") {
    return {}
  }
  const response = await axios.get(`http://localhost:8000/stories/${id}`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('token'),
      "accept": 'application/json',
    },
  });
  console.log(response.data);
  return response.data;
};


const Story = () => {
  const params = useParams()
  const id = params.id
  const [storyInfo, setStoryInfo] = useState(<></>)

  useEffect(() => {
    async function fetchData() {
      const story = await fetchStory(id);
      setStoryInfo(
        <div>
          <h1 className="text-2xl items-center text-center">{story.story.title}</h1>
          <div className="p-16 w-[70%] mx-auto text-lg">{story.story.content}</div>
        </div>
      )
    }
    fetchData()
  }, [])
  return storyInfo
}

export default Story;
