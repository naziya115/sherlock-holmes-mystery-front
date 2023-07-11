'use client'
import StoryGenPage from "@/components/home/StoryGenPage";
import Landing from "@/components/home/landing";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";


export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    session !== null ? (
      <StoryGenPage />
    ) : (
      <Landing />
    )
  );
}
