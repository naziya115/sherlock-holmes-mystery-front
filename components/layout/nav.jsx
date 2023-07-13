'use client'
import { useState, useEffect } from "react";
import NavBar from "./navbar";

export default async function Nav() {
  const [token, settoken] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      settoken(Boolean(token));
    }
  }, []);
  return <NavBar token={token} />;
}
