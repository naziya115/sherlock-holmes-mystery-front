'use client'
import StoryGenPage from '@/components/home/StoryGenPage';
import Landing from '@/components/home/landing';
import NoSsr from "components/NoSsr";


export default function Home() {
  // DONT TOUCH, NO ONE TOUCHES THIS PART OR I'LL KILL YOU!!!!
  return <NoSsr>
    {typeof window !== "undefined" && !localStorage.getItem("token") ? <Landing/> : <StoryGenPage/>}
  </NoSsr>

}

