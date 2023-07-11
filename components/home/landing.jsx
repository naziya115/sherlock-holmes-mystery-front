"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

export default function Landing() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setShowText(true);
  }, []);


  return (
    <Balancer>
      <Image
        src="/sherlock-holmes-icon.png"
        alt="Sherlock Holmes Icon"
        height={100}
        width={100}
      />
      
      <h1 className="mb-1 font-mono text-4xl text-black md:text-6xl">
        Elementary,
      </h1>
      <h1 className="mb-1 font-mono text-4xl text-black md:text-6xl overflow-hidden whitespace-nowrap font-mono text-xl font-bold animate-typing">
        my dear Watson.
      </h1>

      <div className="text-xl font-semibold md:text-3xl">
        generate your own story with Sherlock Holmes
      </div>
    </Balancer>
  )
}