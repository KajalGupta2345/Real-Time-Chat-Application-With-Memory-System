import { useTheme } from "../context/ThemeContext";

const Theme = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
        <i
          className={`fa-solid ${isDark ? "fa-moon" : "fa-sun"} text-[var(--accent)]`}
        ></i>
        {isDark ? "Dark mode" : "Light mode"}
      </span>

      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle theme"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="
          relative w-12 h-7 rounded-[var(--radius-pill)]
          bg-[var(--bg-tertiary)]
          border border-[var(--border-color)]
          transition-colors duration-300
          cursor-pointer
        "
      >
        <span
          className={`
            absolute top-1 left-1
            w-5 h-5 rounded-full
            bg-[var(--accent)]
            shadow-md
            transition-transform duration-300 ease-out
            ${isDark ? "translate-x-0" : "translate-x-5"}
          `}
        />
      </button>
    </div>
  );
};

export default Theme;
