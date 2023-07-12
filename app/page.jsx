'use client'
import StoryGenPage from "@/components/home/StoryGenPage";
import Landing from "@/components/home/landing";
import { useEffect, useState } from "react";


export default async function Home() {
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false)
  
    useEffect(() => {
      window != "undefined" ? setToken(localStorage.getItem("token")) : setToken(null)
      console.log(token)
      console.log(authenticated)
      token ? setAuthenticated(true) : setAuthenticated(false)
    }, [])


  return (
    authenticated ? (
      <StoryGenPage />
    ) : (
      <Landing />
    )
  );
}
