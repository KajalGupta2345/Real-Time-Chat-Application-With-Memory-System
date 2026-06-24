import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ChatItem from "./ChatItem";
import Theme from "./Theme";
import { useChat } from "../context/ChatContext";

const ChatSidebar = ({ onClose }) => {
  const { handleChatSelect, activeChatId, setArr, setActiveChatId } = useChat();

  const { register, reset, handleSubmit } = useForm();
  const menuRef = useRef(null);
  const [menuid, setmenuid] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = (id) => {
    setmenuid((prev) => (prev === id ? null : id));
  };

  // Ek hi jagah se decide hota hai "ye naam already kahin use ho raha hai ya nahi" —
  // create aur rename dono yahi function use karte hain, taaki logic duplicate na ho
  const isTitleTaken = (title, excludeId = null) => {
    const normalized = title.trim().toLowerCase();
    return chats.some(
      (chat) => chat._id !== excludeId && chat.title.trim().toLowerCase() === normalized,
    );
  };

  const handleDeleteChat = (id) => {
    axios
      .delete(`http://localhost:3000/api/chat/${id}`, { withCredentials: true })
      .then(() => {
        setChats((prev) => prev.filter((chat) => chat._id !== id));
        setArr([]);
        setActiveChatId(null);
        setmenuid(null);
      })
      .catch((err) => console.log(err));
  };

  // Ab ye function khud API call karta hai aur true/false return karta hai —
  // taaki ChatItem ko pata chale rename safal hua ya nahi (duplicate naam pe rok dena hai)
  const handleRenameChat = async (id, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return false;

    if (isTitleTaken(trimmed, id)) {
      toast.error("Ye naam already kisi aur chat mein use ho raha hai");
      return false;
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/chat/${id}`,
        { title: trimmed },
        { withCredentials: true },
      );
      setChats((prev) =>
        prev.map((chat) => (chat._id === id ? { ...chat, title: trimmed } : chat)),
      );
      return true;
    } catch (err) {
      console.log("Rename error:", err.response?.data || err.message);
      toast.error("Rename nahi ho paya");
      return false;
    }
  };

  const submitHandler = async (data) => {
    const trimmedTitle = data.title.trim();

    if (isTitleTaken(trimmedTitle)) {
      toast.error("Ye naam already use ho raha hai, alag naam try karo");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/chat/",
        { title: trimmedTitle },
        { withCredentials: true },
      );
      const newChat = res.data.chat;

      setChats((prev) => [newChat, ...prev]);
      setArr([]);
      setActiveChatId(newChat._id);

      reset();
    } catch (err) {
      console.log("Error creating chat:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/chat/", { withCredentials: true })
      .then((response) => {
        setChats(response.data.chats.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const handleCloseMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setmenuid(null);
      }
    };
    document.addEventListener("mousedown", handleCloseMenu);
    return () => document.removeEventListener("mousedown", handleCloseMenu);
  }, []);

  // Search query ke hisaab se list filter — case-insensitive
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <div
      className="
        bg-[var(--bg-secondary)] text-[var(--text-secondary)]
        w-[270px]
        p-4 flex flex-col justify-between relative h-full z-50
        border-r border-[var(--border-color)]
        transition-colors duration-300
      "
    >
      <button
        type="button"
        className="
          md:hidden flex items-center justify-center
          w-10 h-10 rounded-[var(--radius-md)]
          bg-[var(--bg-tertiary)]
          border border-[var(--border-color)]
          text-[var(--text-primary)] text-xl
          absolute top-3 right-4 z-10
          hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]
          active:scale-95 transition-colors duration-200
        "
        onClick={onClose}
      >
        <i className="ri-close-line"></i>
      </button>

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--accent)] flex items-center justify-center text-white text-sm font-bold shadow-md">
            Z
          </div>
          <span className="text-[var(--text-primary)] font-semibold">Zoro</span>
        </div>

        <div className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="New chat..."
              className="
                min-w-0 flex-1
                px-3 py-2.5 text-sm rounded-[var(--radius-md)]
                bg-[var(--bg-input)]
                text-[var(--text-primary)]
                border border-[var(--border-color)]
                placeholder:text-[var(--text-secondary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                transition-colors duration-200
              "
            />
            <button
              type="submit"
              title="Start a new chat"
              className="
                flex-shrink-0 w-10 h-10
                flex items-center justify-center
                rounded-[var(--radius-md)]
                bg-[var(--accent)] text-white
                hover:bg-[var(--accent-strong)]
                active:scale-95 transition
              "
            >
              <i className="fa-solid fa-pen-to-square text-sm"></i>
            </button>
          </form>

          {/* Search — ab actual input hai, list ko live filter karta hai */}
          <div
            className="
              flex gap-2 items-center
              rounded-[var(--radius-md)] px-3 py-2.5
              bg-[var(--bg-input)]
              border border-[var(--border-color)]
              focus-within:ring-2 focus-within:ring-[var(--accent)]
              transition-colors duration-200
            "
          >
            <i className="ri-search-line text-sm text-[var(--text-secondary)]"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="
                flex-1 bg-transparent text-sm
                text-[var(--text-primary)]
                placeholder:text-[var(--text-secondary)]
                focus:outline-none
              "
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-8 gap-1.5 flex-1 overflow-y-auto">
        <h1 className="text-[var(--text-secondary)] font-semibold text-xs uppercase tracking-wide px-1 mb-1">
          Your Chats
        </h1>

        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              isActive={activeChatId === chat._id}
              isMenuOpen={menuid === chat._id}
              handleChatSelect={handleChatSelect}
              toggleMenu={toggleMenu}
              handleDeleteChat={handleDeleteChat}
              menuRef={menuRef}
              handleRenameChat={handleRenameChat}
            />
          ))
        ) : chats.length === 0 ? (
          <p className="px-3 mt-4 text-xs text-[var(--text-secondary)] italic">
            No chats yet...
          </p>
        ) : (
          <p className="px-3 mt-4 text-xs text-[var(--text-secondary)] italic">
            No chats match "{searchQuery}"
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border-color)]">
        <Theme />
        <p className="text-center text-xs text-[var(--text-secondary)]">
          Built with ❤️ using Zoro
        </p>
      </div>
    </div>
  );
};

export default ChatSidebar;

