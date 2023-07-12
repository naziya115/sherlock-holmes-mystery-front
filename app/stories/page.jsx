import { authOptions } from "@/lib/authOptions";
import { getServerSession, } from "next-auth/next";
import { redirect } from "next/navigation";
import Stories from "./stories";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return ( 
    session !== null ? (
      <Stories />
    ) : (
        redirect("/")
    )
  );
  
}
