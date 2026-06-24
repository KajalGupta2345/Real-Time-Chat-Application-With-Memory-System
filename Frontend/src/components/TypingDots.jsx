const TypingDots = () => {
  return (
    <div className="mb-4 flex justify-start msg-in">
      <div className="bg-[var(--ai-bubble-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] px-5 py-4">
        <div className="typing-dots flex gap-2 text-[var(--text-secondary)]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingDots;