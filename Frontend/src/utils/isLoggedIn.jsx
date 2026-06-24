import axios from "axios";

const isLoggedIn = async () => {
  try {
    await axios.get("https://real-time-chat-application-with-memory.onrender.com/api/auth/me", {
      withCredentials: true,
    });
    return true;
  } catch {
    return false;
  }
};

export default isLoggedIn;