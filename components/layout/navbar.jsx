"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";

export default function NavBar({ token }) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 w-full ${scrolled
          ? "bg-[#F8F8F8]"
          : "bg-[#F8F8F8]"
          } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <div className="flex flex-grow justify-end"> {/* Add flex-grow and justify-end classes */}
            {token ? (
              <UserDropdown token={token} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

