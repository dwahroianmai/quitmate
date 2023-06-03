import Nav from "./nav";
import Error from "./error";
import Footer from "./footer";
import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LeftPart from "./leftPart";
import ThemeContext from "./themeContext";

axios.defaults.baseURL = "https://quitmate-api.fly.dev";
axios.defaults.withCredentials = true;

function SignUp() {
  const [bg, setBg] = useState("");
  const [strength, setStrength] = useState("Please, enter password.");
  const [confirmed, setConfirmed] = useState("");
  const [confirm, setConfirm] = useState("Please, confirm password.");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [signin, setSignin] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setPlaceholder("placeholder");
    } else {
      setPlaceholder("placeholder-dark");
    }
  }, [theme]);

  function checkStrength(e) {
    setPassword(e.target.value);
    const regexMedium = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
    const regexStrong =
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (e.target.value === "") {
      setStrength("Please, enter password");
      setBg("bg-white");
    } else {
      if (regexStrong.test(e.target.value)) {
        setStrength("Strong");
        setBg("bg-green-800");
      } else if (regexMedium.test(e.target.value)) {
        setStrength("Medium");
        setBg("bg-orange-500");
      } else {
        setStrength("Weak");
        setBg("bg-red-600");
      }
    }
  }

  function checkConfirmed(e) {
    setPasswordConfirm(e.target.value);
    let passwordC = e.target.value;
    if (passwordC !== "") {
      if (password === passwordC) {
        setConfirmed("bg-green-800");
        setConfirm("Passwords match.");
      } else {
        setConfirmed("bg-red-600");
        setConfirm("Passwords don't match.");
      }
    }
  }

  function sendForm(e) {
    e.preventDefault();
    axios
      .post("https://quitmate-api.fly.dev/signup", {
        username,
        password,
        passwordConfirm,
      })
      .then((response) => {
        let error = response.data;
        setErrorMsg(error);
        if (error === "") {
          setSignin(true);
        }
      });
  }

  if (signin) {
    return <Navigate to="/signin" />;
  }

  return (
    <div>
      <Nav />
      <LeftPart
        text={
          '"Imagine how much better your life could be without cigarettes. You\'ll have more energy, better focus, and a stronger immune system"'
        }
        hidden="hideMedia"
      />
      <div className=" p-[30px] h-1/2 lg:h-screen lg:w-[50vw] lg:shadow-form w-screen absolute right-0 top-0 flex flex-col gap-5 ">
        <form className=" mt-20 lg:mt-[10%] flex flex-col items-center gap-2 lg:gap-[30px] ">
          <div className=" flex flex-col gap-2 lg:gap-4 ">
            <div className=" relative p-[13px] ">
              <input
                required
                autoFocus
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className={placeholder}>Username</span>
            </div>
            <div className=" relative p-[13px] ">
              <input
                required
                id="password-up"
                name="password"
                type="password"
                value={password}
                onChange={checkStrength}
              />
              <span className={placeholder}>Password</span>
            </div>
            <div className=" relative p-[13px] ">
              <input
                required
                id="password-confirm"
                name="password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={checkConfirmed}
              />
              <span className={placeholder}>Confirm password</span>
            </div>
          </div>
          <Error error={errorMsg} />
          <div className=" self-start ml-5 lg:ml-[20%] flex flex-col gap-[10px] ">
            <div className=" flex items-center gap-[10px] ">
              <div
                className={` rounded-full h-[10px] w-[10px] ${bg}`}
                id="circle-strength"
              ></div>
              <p id="strength">{strength}</p>
            </div>
            <div className=" flex items-center gap-[10px] ">
              <div
                className={` rounded-full h-[10px] w-[10px] ${confirmed}`}
                id="circle-match"
              ></div>
              <p id="passwords-match">{confirm}</p>
            </div>
          </div>
          <button
            type="submit"
            className="w-11/12 lg:w-3/5 h-[50px] lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
            onClick={sendForm}
          >
            Sign Up
          </button>
        </form>
        <p className=" text-center text-lg lg:text-xl ">
          Already have an account?{" "}
          <a href="/signin" className=" text-green-600">
            Sign in
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;
