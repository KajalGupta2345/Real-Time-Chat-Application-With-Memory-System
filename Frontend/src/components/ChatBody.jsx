import TypingDots from "./TypingDots";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import axios from "axios";
import { useChat } from "../context/ChatContext";

const ChatBody = () => {
  const { arr, activeChatId, isTyping, setAuth } = useChat();
  const [isopen, setisopen] = useState(false);
  const profileRef = useRef(null);
  const bottomRef = useRef(null);

  const handleProfile = () => setisopen(!isopen);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true },
      );
      if (response.status === 200) {
        setAuth(false);
        toast.success("Logged out successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Logout failed!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setisopen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [arr, isTyping]);

  return (
    <>
      <nav
        className="
          w-full sticky top-0 z-40 py-4 px-8
          border-b border-[var(--border-color)]
          flex justify-between items-center
          text-[var(--text-primary)] text-lg
          bg-[var(--bg-primary)]
          transition-colors duration-300
        "
      >
        <span className="flex items-center gap-2">
          <p className="md:text-xl ml-12 md:ml-0">Zoro</p>
          <i className="fa-solid fa-chevron-down text-xs text-[var(--text-secondary)]"></i>
        </span>

        <div className="relative">
          <span onClick={handleProfile}>
            <i className="fa-solid fa-circle-user text-[var(--accent)] text-3xl cursor-pointer"></i>
          </span>

          {isopen && (
            <div
              ref={profileRef}
              className="
                absolute top-full right-0 mt-2
                bg-[var(--bg-secondary)] backdrop-blur-md
                border border-[var(--border-color)]
                shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                text-sm w-48 rounded-[var(--radius-md)]
                text-[var(--text-primary)]
                overflow-hidden
              "
            >
              <div className="px-4 py-2.5 hover:bg-[var(--bg-tertiary)] cursor-pointer flex gap-2 items-center">
                <i className="fa-solid fa-gear"></i>Settings
              </div>
              <div className="px-4 py-2.5 hover:bg-[var(--bg-tertiary)] cursor-pointer flex gap-2 items-center">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>Upgrade
                plan
              </div>
              <div
                onClick={handleLogout}
                className="px-4 py-2.5 hover:bg-[var(--bg-tertiary)] cursor-pointer flex gap-2 items-center"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>Log out
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex-1 p-5 overflow-y-auto max-w-3xl w-full mx-auto scrollbar-none">
        {!activeChatId ? (
          <div className="flex flex-col items-center justify-center mt-40 gap-3 text-center">
            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--accent-soft)] flex items-center justify-center">
              <i className="fa-regular fa-comment-dots text-3xl text-[var(--accent)]"></i>
            </div>
            <h1 className="text-4xl text-[var(--text-secondary)] font-bold">
              What can I help you?
            </h1>
          </div>
        ) : arr?.length > 0 ? (
          <>
            {arr.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex gap-3 msg-in ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs mt-1">
                    <i className="fa-solid fa-sparkles"></i>
                  </div>
                )}
                <div
                  className={`
                    px-5 py-3.5 rounded-[var(--radius-lg)]
                    leading-relaxed whitespace-pre-wrap break-words
                    text-sm text-[var(--text-primary)] max-w-[80%]
                    ${
                      msg.role === "user"
                        ? "bg-gradient-to-b from-[var(--user-bubble-from)] to-[var(--user-bubble-to)]"
                        : "bg-[var(--ai-bubble-bg)] border border-[var(--border-color)]"
                    }
                  `}
                >
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && <TypingDots />}
            <div ref={bottomRef} />
          </>
        ) : (
          <p className="text-2xl font-semibold text-[var(--text-primary)] mt-40 text-center">
            No messages yet, start the conversation.
          </p>
        )}
      </div>
    </>
  );
};

export default ChatBody;
