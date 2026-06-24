import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      await axios.post(
        "https://real-time-chat-application-with-memory.onrender.com/api/auth/login",
        { email: data.email, password: data.password },
        { withCredentials: true },
      );

      toast.success("Welcome back!");
      setAuth(true);
      reset();
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Wrong email or password!";
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className="
        w-full min-h-screen flex items-center justify-center
        bg-[var(--bg-secondary)]
        text-[var(--text-primary)]
        p-4
        transition-colors duration-300
      "
    >
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="
          w-full max-w-md
          p-8 rounded-[var(--radius-lg)]
          bg-[var(--bg-input)]
          border border-[var(--border-color)]
          shadow-lg
          backdrop-blur-md
        "
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
          Welcome back to Zoro ⚡
        </p>

        {/* EMAIL */}
        <div className="mt-6">
          <label className="text-sm mb-1 block text-[var(--text-secondary)]">
            Email Address
          </label>

          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="you@example.com"
            className="
              w-full px-3 py-2.5 rounded-[var(--radius-md)]
              bg-[var(--bg-secondary)]
              border border-[var(--border-color)]
              text-[var(--text-primary)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              transition-colors duration-200
            "
          />

          {errors.email && (
            <p className="text-xs text-[var(--danger)] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <label className="text-sm mb-1 block text-[var(--text-secondary)]">
            Password
          </label>

          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter password"
            className="
              w-full px-3 py-2.5 rounded-[var(--radius-md)]
              bg-[var(--bg-secondary)]
              border border-[var(--border-color)]
              text-[var(--text-primary)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              transition-colors duration-200
            "
          />

          {errors.password && (
            <p className="text-xs text-[var(--danger)] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full mt-8 py-3
            bg-[var(--accent)]
            text-white font-semibold
            rounded-[var(--radius-md)]
            hover:bg-[var(--accent-strong)]
            active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed
            transition
          "
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        {/* LINK */}
        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--accent)] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
