import axios from "axios";

const isLoggedIn = async () => {
  try {
    await axios.get("http://localhost:3000/api/auth/me", {
      withCredentials: true,
    });
    return true;
  } catch {
    return false;
  }
};

export default isLoggedIn;