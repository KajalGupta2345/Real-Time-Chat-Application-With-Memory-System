import { useForm } from "react-hook-form";
import { useChat } from "../context/ChatContext";

const ChatInput = () => {
  const { setArr, socket, activeChatId } = useChat();
  const { register, reset, handleSubmit, watch } = useForm();
  const messageValue = watch("message", "");

  const submitHandler = (data) => {
    if (!data.message.trim()) return;
    const msg = { role: "user", content: data.message };
    setArr((prev) => [...prev, msg]);

    socket.emit("ai-message", {
      chat: activeChatId,
      content: data.message,
    });

    reset();
  };

  return (
    <div className="w-full px-4 py-3 flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="
          flex items-center gap-3
          w-full max-w-3xl
          px-4 py-2
          rounded-[var(--radius-pill)]
          bg-[var(--bg-input)]
          border border-[var(--border-color)]
          shadow-[0_10px_35px_rgba(0,0,0,0.25)]
          backdrop-blur-md
          focus-within:ring-2 focus-within:ring-[var(--accent)]
          transition-all duration-200
        "
      >
        <input
          className="
            flex-1 px-4 py-3
            bg-transparent
            text-[var(--text-primary)]
            placeholder:text-[var(--text-secondary)]
            focus:outline-none
          "
          placeholder="Ask anything"
          autoComplete="off"
          {...register("message")}
        />

        <button
          type="submit"
          disabled={!messageValue?.trim()}
          className="
            rounded-[var(--radius-pill)] px-2 py-1
            bg-[var(--accent)]
            disabled:bg-[var(--bg-tertiary)]
            disabled:cursor-not-allowed
            hover:bg-[var(--accent-strong)]
            transition
          "
        >
          <i className="ri-arrow-up-line text-white text-xl"></i>
        </button>
      </form>
      <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed tracking-wide">
        ZORO can make mistakes. Check important info. See Cookie Preferences.
      </p>
    </div>
  );
};

export default ChatInput;