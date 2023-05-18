import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import close from "../img/close-outline.svg";
import ThemeContext from "./themeContext";

function Password({ f }) {
  const [message, setMessage] = useState(
    "Please, enter your current password and the new password."
  );
  const [current, setCurrent] = useState("");
  const [newP, setNewP] = useState("");
  const [confirm, setConfirm] = useState("");
  const [circle, setCircle] = useState("bg-red-600");
  const [match, setMatch] = useState("Please, confirm your new password.");
  const [sent, setSent] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [placeholder, setPlaceholder] = useState("");
  const [closeColor, setCloseColor] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setPlaceholder("placeholder");
      setCloseColor("");
    } else {
      setPlaceholder("placeholder-dark");
      setCloseColor("logo-white");
    }
  }, [theme]);

  function changePassword(e) {
    e.preventDefault();
    axios
      .post("https://quitmate-api.onrender.com/changepassword", {
        current,
        newP,
        confirm,
      })
      .then((res) => {
        setMessage(res.data);
        setSent(true);
      });
  }

  function confirmPassword(e) {
    setConfirm(e.target.value);
    let c = e.target.value;
    if (c === newP) {
      setCircle("bg-green-600");
      setMatch("Password confirmed.");
    } else {
      setCircle("bg-red-600");
      setMatch("Password is not confirmed.");
    }
  }

  if (sent) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col gap-[20px] items-start w-[90%] lg:w-[570px] ml-auto mr-auto mt-10 shadow-inset rounded-[10px] p-[20px] relative">
      <h4 className="text-2xl hover:cursor-default lg:mt-2">{message}</h4>
      <img
        src={close}
        alt="close"
        className={`absolute right-3 top-3 h-[30px] hover:scale-150 active:scale-100 ${closeColor}`}
        onClick={f}
      ></img>
      <form className="flex flex-col gap-[20px] items-start w-full lg:w-[570px] ">
        <div className="relative p-[10px] m-[-10px]">
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setCurrent(e.target.value)}
            value={current}
          />
          <span className={placeholder}>Current password</span>
        </div>
        <div className="relative p-[10px] m-[-10px]">
          <input
            id="new-password"
            name="new-password"
            type="password"
            onChange={(e) => setNewP(e.target.value)}
            value={newP}
          />
          <span className={placeholder}>New password</span>
        </div>
        <div className="relative p-[10px] m-[-10px]">
          <input
            id="new-password-confirm"
            name="new-password-confirm"
            type="password"
            onChange={confirmPassword}
            value={confirm}
          />
          <span className={placeholder}>Confirm new password</span>
        </div>
        <div className=" flex items-center gap-[10px] self-start">
          <div
            className={` rounded-full h-[10px] w-[10px] ${circle}`}
            id="circle-match"
          ></div>
          <p id="passwords-match">{match}</p>
        </div>
        <button
          className=" self-center p-1 lg:p-0 w-3/5 lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
          onClick={changePassword}
        >
          Change password
        </button>
      </form>
    </div>
  );
}

export default Password;
