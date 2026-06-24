import { useEffect, useRef, useState } from "react";

const ChatItem = ({
  chat,
  isActive,
  isMenuOpen,
  handleChatSelect,
  toggleMenu,
  handleDeleteChat,
  handleRenameChat,
  menuRef,
}) => {
  const [isEditing, setisEditing] = useState(false);
  const inputRef = useRef(null);
  const [titleValue, settitleValue] = useState(chat.title);

  const renameHandler = () => {
    setisEditing(true);
    toggleMenu(null);
  };

  // handleRenameChat (ChatSidebar se aaya) ab khud duplicate-check + API call + state update
  // sab kar leta hai aur true/false return karta hai. Agar false aaya (jaise duplicate naam),
  // editing mode mein hi rehte hain taaki user naam badal sake — usse dobara type nahi karna padega
  const handleFinalSave = async () => {
    const success = await handleRenameChat(chat._id, titleValue);
    if (success) {
      setisEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) inputRef.current.select();
  }, [isEditing]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleChatSelect(chat._id);
      }}
      className={`
        text-sm relative cursor-pointer px-4 py-2.5
        flex justify-between items-center whitespace-nowrap
        rounded-[var(--radius-md)] text-[var(--text-primary)] group
        transition-colors duration-150
        ${
          isActive
            ? "bg-[var(--accent-soft)] border border-[var(--accent)]"
            : "bg-transparent border border-transparent hover:bg-[var(--bg-tertiary)]"
        }
      `}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="outline-none bg-transparent w-full text-[var(--text-primary)]"
          onChange={(e) => settitleValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          value={titleValue}
          onKeyDown={(e) => e.key === "Enter" && handleFinalSave()}
        />
      ) : (
        <span className="truncate">{titleValue}</span>
      )}

      <button
        type="button"
        className="
          w-6 h-6 shrink-0 rounded-full
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]
          transition-colors duration-200
        "
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(chat._id);
        }}
      >
        <i className="ri-more-2-fill text-sm"></i>
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="
            bg-[var(--bg-secondary)] backdrop-blur-md
            border border-[var(--border-color)]
            shadow-lg w-36 rounded-[var(--radius-md)]
            absolute top-full right-0 mt-1 z-50
            overflow-hidden
          "
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChat(chat._id);
            }}
            className="px-4 py-2 text-[var(--danger)] text-sm hover:bg-[var(--bg-tertiary)] cursor-pointer flex gap-2 items-center"
          >
            <i className="ri-delete-bin-6-line"></i>Delete
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              renameHandler();
            }}
            className="px-4 py-2 text-[var(--text-secondary)] text-sm hover:bg-[var(--bg-tertiary)] cursor-pointer flex gap-2 items-center"
          >
            <i className="ri-pencil-line"></i>Rename
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
