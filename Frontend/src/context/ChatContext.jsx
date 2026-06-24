import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const ChatContext = createContext(null);

export const ChatProvider = ({ children, setAuth }) => {
  const [arr, setArr] = useState([]);
  const [socket, setSocket] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // "Abhi sabse aakhri click kis chat pe hua" — race-condition guard ke liye
  const latestRequestRef = useRef(null);

  const handleChatSelect = useCallback(async (id) => {
    if (!id) return;
    latestRequestRef.current = id;

    setActiveChatId(id);
    setArr([]);

    try {
      const res = await axios.get(`http://localhost:3000/api/messages/${id}`, {
        withCredentials: true,
      });

      // Beech mein user kisi aur chat pe click kar gaya to ye purana response discard
      if (latestRequestRef.current !== id) return;

      setArr(res.data.messages);
    } catch (err) {
      console.log(err);
      toast.error("Messages load nahi ho paye");
    }
  }, []);

  // Socket connect — sirf ek baar
  useEffect(() => {
    const socketInstance = io("http://localhost:3000/", {
      withCredentials: true,
    });
    setSocket(socketInstance);

    socketInstance.on("ai-start", () => {
      setIsTyping(true);
    });

    socketInstance.on("ai-response", (response) => {
      setIsTyping(false);
      setArr((prev) => [...prev, { role: "model", content: response.content }]);
    });

    return () => socketInstance.disconnect();
  }, []);

  // activeChatId badle to room join/leave
  useEffect(() => {
    if (!socket || !activeChatId) return;
    socket.emit("join-chat", { chatId: activeChatId });
    return () => socket.emit("leave-chat", { chatId: activeChatId });
  }, [socket, activeChatId]);

  const value = useMemo(
    () => ({
      arr,
      setArr,
      socket,
      activeChatId,
      setActiveChatId,
      isTyping,
      handleChatSelect,
      setAuth,
    }),
    [arr, socket, activeChatId, isTyping, handleChatSelect, setAuth],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);