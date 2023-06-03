import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import close from "../img/close-outline.svg";
import ThemeContext from "./themeContext";

function Time({ f }) {
  const [time, setTime] = useState("");
  const [checked, setChecked] = useState(false);
  const [set, setSet] = useState(false);
  const [message, setMessage] = useState(
    "When did you smoke your last cigarette?"
  );
  const { theme, setTheme } = useContext(ThemeContext);
  const [placeholder, setPlaceholder] = useState("");
  const [closeColor, setCloseColor] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      setPlaceholder("placeholder");
      setCloseColor("");
    } else {
      setPlaceholder("placeholder-dark");
      setCloseColor("logo-white");
    }
  }, [theme]);

  function reset(e) {
    e.preventDefault();
    let ms = new Date().getTime();
    let now;
    // used useState hook before, time didn't set before sending to the server
    if (checked) {
      now = new Date(parseInt(ms) + 2 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      axios
        .post("https://quitmate-api.fly.dev/resettime", { time: now })
        .then(() => {
          setMessage("Time was reset.");
          setSet(true);
        });
      return;
    }
    axios.post("https://quitmate-api.fly.dev/resettime", { time }).then(() => {
      setMessage("Time was reset.");
      setSet(true);
    });
  }

  function check() {
    if (checked) {
      setChecked(false);
      setDisabled(false);
    } else {
      setChecked(true);
      setDisabled(true);
    }
  }

  if (set) {
    return <Navigate to="/" />;
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
        <div className="flex gap-[10px] items-center">
          <input
            type="checkbox"
            name="now"
            id="now"
            className="h-[20px] w-[20px] accent-green-900 outline-green-900"
            onChange={() => {
              checked ? setChecked(false) : setChecked(true);
            }}
            checked={checked}
          />
          <p className="text-xl" onClick={check}>
            Just now
          </p>
        </div>
        <div className="relative p-[10px] m-[-10px]">
          <input
            id="time"
            name="time"
            type="text"
            onFocus={(e) => (e.target.type = "datetime-local")}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={disabled}
          />
          <span className={placeholder}>Please, enter new time</span>
        </div>
        <button
          className=" self-center p-1 lg:p-0 w-3/5 lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
          onClick={reset}
        >
          Reset time
        </button>
      </form>
    </div>
  );
}

export default Time;
