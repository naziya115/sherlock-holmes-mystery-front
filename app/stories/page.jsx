'use client'
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Stories from "./stories";

export default async function Home() {
  const [hasToken, setHasToken] = useState(true);
  console.log(hasToken)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setHasToken(Boolean(token));
    }
  },[]);

  return ( 
    hasToken ? (
      <Stories />
    ) : (
        redirect("/")
    )
  );
  
}
