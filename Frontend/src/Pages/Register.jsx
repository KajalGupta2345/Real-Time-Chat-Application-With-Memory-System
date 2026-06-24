import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: data.email,
          fullName: {
            firstName: data.firstname,
            lastName: data.lastname,
          },
          password: data.password,
        },
        { withCredentials: true },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Account created successfully!");
        reset();
        navigate("/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed!";
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
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        <p className="text-sm text-[var(--text-secondary)] text-center mt-2">
          Join Zoro and start chatting ⚡
        </p>

        {/* EMAIL */}
        <div className="mt-6">
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
            <p className="text-xs text-[var(--danger)] mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* NAME FIELDS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="w-full">
            <input
              type="text"
              {...register("firstname", { required: "First name required" })}
              placeholder="First Name"
              className="
                w-full px-3 py-2.5 rounded-[var(--radius-md)]
                bg-[var(--bg-secondary)]
                border border-[var(--border-color)]
                text-[var(--text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                transition-colors duration-200
              "
            />
            {errors.firstname && (
              <p className="text-xs text-[var(--danger)] mt-1">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              type="text"
              {...register("lastname", { required: "Last name required" })}
              placeholder="Last Name"
              className="
                w-full px-3 py-2.5 rounded-[var(--radius-md)]
                bg-[var(--bg-secondary)]
                border border-[var(--border-color)]
                text-[var(--text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                transition-colors duration-200
              "
            />
            {errors.lastname && (
              <p className="text-xs text-[var(--danger)] mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            placeholder="Create password"
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
            <p className="text-xs text-[var(--danger)] mt-1">{errors.password.message}</p>
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
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        {/* LINK */}
        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;