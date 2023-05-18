import logo from "../img/smoke.png";
import sun from "../img/sunny-outline.svg";
import moon from "../img/moon-outline.svg";
import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import "../styles.css";
import ThemeContext from "./themeContext";

function Nav({ settings }) {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState(null);
  const [bg, setBg] = useState("");
  const [hidden, setHidden] = useState("");
  const [center, setCenter] = useState("justify-center");
  const [dots, setDots] = useState("hidden");
  const [visible, setVisible] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [bgSettings, setBgSettings] = useState("");
  const [themePic, setThemePic] = useState("");
  const [textColor, setTextColor] = useState("");
  const [aColor, setAColor] = useState("");
  const [logoColor, setLogoColor] = useState("");
  const visibleRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/authorized").then((res) => {
      setAuth(res.data["authorized"]);
      setName(res["data"]["username"]);
      if (res.data["authorized"]) {
        setBg("bg-green-900");
        setHidden("hidden");
        setCenter("justify-between");
        setDots("flex");
      }
    });
  }, []);

  useEffect(() => {
    if (theme === "light") {
      setBgSettings("bg-white");
      setThemePic("logo-green");
      setTextColor("text-green-900");
      setAColor("text-green-900");
      setLogoColor("logo-green");
    } else {
      setBgSettings("bg-zinc-950");
      setThemePic("logo-white");
      setTextColor("text-white");
      setAColor("text-white");
      setLogoColor("logo-white");
    }
  }, [theme]);

  function showSettings() {
    setVisible(true);
  }

  function clickOutside(e) {
    if (visibleRef.current && !visibleRef.current.contains(e.target)) {
      setVisible(false);
    }
  }

  function toggleTheme() {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("mode", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("mode", "light");
    }
  }

  return (
    <nav
      className={` w-screen p-3 flex gap-20 items-center ${center} lg:justify-between ${bg} `}
    >
      <a
        href="/"
        className={` no-underline font-semibold ${aColor} lg:block lg:text-white relative z-10`}
      >
        <div className=" flex gap-2 lg:gap-4 justify-between items-center ">
          {auth ? (
            <img
              id="app-logo"
              src={logo}
              alt="QuitMate logo"
              className={` h-[50px] w-[50px] lg:h-[70px] lg:w-[70px] lg:logo-white logo-white`}
            />
          ) : (
            <img
              id="app-logo"
              src={logo}
              alt="QuitMate logo"
              className={` h-[50px] w-[50px] lg:h-[70px] lg:w-[70px] lg:logo-white ${logoColor}`}
            />
          )}
          <h1 className={` ${hidden} lg:block text-[40px] lg:text-[50px] `}>
            QuitMate
          </h1>
        </div>
      </a>
      <h2 className=" lg:text-3xl text-xl absolute left-0 right-0 mr-auto ml-auto max-w-[80%] text-center text-white">
        {auth ? `Hello, ${name}` : ""}
      </h2>
      <div className="hidden lg:flex gap-4 justify-between items-center">
        <div>
          {auth ? (
            theme === "dark" ? (
              <img
                src={sun}
                alt="light mode"
                className="logo-white h-7"
                onClick={toggleTheme}
              />
            ) : (
              <img
                src={moon}
                alt="dark mode"
                className="logo-white h-7"
                onClick={toggleTheme}
              />
            )
          ) : null}
        </div>
        <a href="/settings" className="text-xl text-white">
          {auth ? settings : ""}
        </a>
        <a href="/signout" className="text-xl text-white">
          {auth ? "Sign Out" : ""}
        </a>
      </div>
      <div className={` lg:hidden ${dots} gap-1 `} onClick={showSettings}>
        <div className=" h-2 w-2 rounded-full bg-white"></div>
        <div className=" h-2 w-2 rounded-full bg-white"></div>
        <div className=" h-2 w-2 rounded-full bg-white"></div>
      </div>
      {visible && (
        <div
          className={` lg:hidden absolute w-full z-[1000] p-5 top-16 left-0 flex gap-2 justify-around ${bgSettings}`}
          ref={visibleRef}
        >
          <div>
            {theme === "dark" ? (
              <img
                src={sun}
                alt="light mode"
                className={`${themePic} h-7`}
                onClick={toggleTheme}
              />
            ) : (
              <img
                src={moon}
                alt="dark mode"
                className={`${themePic} h-7`}
                onClick={toggleTheme}
              />
            )}
          </div>
          <a href="/settings" className={`text-xl ${textColor}`}>
            {auth ? settings : ""}
          </a>
          <a href="/signout" className={`text-xl ${textColor}`}>
            {auth ? "Sign Out" : ""}
          </a>
        </div>
      )}
    </nav>
  );
}

export default Nav;
