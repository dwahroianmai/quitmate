import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import close from "../img/close-outline.svg";
import ThemeContext from "./themeContext";

function Remove({ f }) {
  const [message, setMessage] = useState(
    "Are you sure you want to delete your account? All the data will be lost."
  );
  const [removed, setRemoved] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [closeColor, setCloseColor] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setCloseColor("");
    } else {
      setCloseColor("logo-white");
    }
  }, [theme]);

  function removeAccount(e) {
    e.preventDefault();
    axios.get("https://quitmate-api.fly.dev/removeuser").then((res) => {
      setMessage("Your account was removed.");
      setRemoved(true);
    });
  }

  if (removed) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="flex flex-col gap-[20px] items-start w-[90%] lg:w-[570px] ml-auto mr-auto mt-10 shadow-inset rounded-[10px] p-[20px] relative">
      <h4 className="text-2xl hover:cursor-default">{message}</h4>
      <img
        src={close}
        alt="close"
        className={`absolute right-3 top-3 h-[30px] hover:scale-150 active:scale-100 ${closeColor}`}
        onClick={f}
      ></img>
      <form className="flex flex-col gap-[20px] items-start w-full lg:w-[570px] ">
        <button
          className=" text-red-600 self-center p-1 lg:p-0 w-3/5 lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
          onClick={removeAccount}
        >
          Delete account
        </button>
      </form>
    </div>
  );
}

export default Remove;
