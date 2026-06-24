import ChatSidebar from "../components/ChatSidebar";
import ChatBody from "../components/ChatBody";
import ChatInput from "../components/ChatInput";
import { useState } from "react";
import { ChatProvider } from "../context/ChatContext";

const Home = ({ setAuth }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <ChatProvider setAuth={setAuth}>
      <div className="w-full flex h-screen relative bg-[var(--bg-primary)] transition-colors duration-300">
        <button
          type="button"
          className="
            md:hidden flex items-center justify-center
            w-10 h-10 rounded-[var(--radius-md)]
            bg-[var(--bg-tertiary)]
            border border-[var(--border-color)]
            text-[var(--text-primary)] text-xl
            absolute top-3 left-3 z-40
            hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]
            active:scale-95 transition-colors duration-200
          "
          onClick={() => setShowSidebar(true)}
        >
          <i className="ri-menu-line"></i>
        </button>

        {/* Mobile Sidebar — slide in/out */}
        <div
          className={`
            fixed inset-0 z-50 md:hidden
            transition-opacity duration-300
            ${showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSidebar(false)}
          />
          <div
            className={`
              relative h-full w-fit
              transition-transform duration-300 ease-out
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <ChatSidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <ChatSidebar />
        </div>

        <div className="flex flex-col justify-between w-full bg-[var(--bg-primary)]">
          <ChatBody />
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Home;