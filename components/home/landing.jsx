"use client"
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export default function Landing() {
  return (
    <Balancer>
      <Image
        src="/sherlock-holmes-icon.png"
        alt="Sherlock Holmes Icon"
        height={100}
        width={100}
      />
      
      <h1 className="mb-1 text-xl md:text-4xl lg:text-6xl xl:text-6xl font-mono text-black font-bold">
        Elementary,
      </h1>
      <h1 className="mb-1 text-xl md:text-4xl lg:text-6xl xl:text-6xl text-black overflow-hidden whitespace-nowrap font-mono font-bold animate-typing">
        my dear Watson.
      </h1>

      <div className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-semibold">
        * generate your own story with Sherlock Holmes
      </div>

    </Balancer>
  )
}