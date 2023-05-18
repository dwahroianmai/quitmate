import instLogo from "../img/Icon.svg";
import twitterLogo from "../img/twi.svg";
import telegramLogo from "../img/telegram.svg";
import fbLogo from "../img/logo-facebook.svg";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "./themeContext";

function LeftPart({ text, hidden }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setColor("");
    } else {
      setColor("logo-white");
    }
  }, [theme]);

  return (
    <>
      <div className="hidden lg:flex items-center justify-center w-[40vw] h-[70vh] bg-green-900 absolute top-0 left-0 z-0 rounded-lft ">
        <h2 className=" w-4/5 text-slate-50 text-4xl font-normal ">{text}</h2>
      </div>
      <div
        className={` absolute w-[300px] mr-auto ml-auto left-0 right-0 bottom-14 lg:left-[90px] lg:right-auto lg:w-auto lg:bottom-[20vh] flex gap-4 items-center justify-center ${hidden}`}
      >
        <img
          src={instLogo}
          alt="instagram logo"
          className={` h-8 lg:h-12 hover:scale-[1.05] active:scale-0 transition duration-400 ${color}`}
        />
        <img
          src={twitterLogo}
          alt="twitter logo"
          className={` h-8 lg:h-12 hover:scale-[1.05] active:scale-0 transition duration-400 ${color}`}
        />
        <img
          src={telegramLogo}
          alt="telegram logo"
          className={` h-8 lg:h-12 hover:scale-[1.05] active:scale-0 transition duration-400 ${color}`}
        />
        <img
          src={fbLogo}
          alt="facebook logo"
          className={` h-8 lg:h-12 hover:scale-[1.05] active:scale-0 transition duration-400 ${color}`}
        />
      </div>
    </>
  );
}

export default LeftPart;
