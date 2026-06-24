import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>

      {/* ToastContainer ThemeProvider ke bahar — isko apna alag "theme" prop chahiye, humare context se kuch lena dena nahi */}
      <ToastContainer position="top-center" theme="dark" autoClose={2000} />
    </>
  );
};

export default App;