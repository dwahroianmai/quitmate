import Nav from "./nav";
import LeftPart from "./leftPart";
import buttonAndSeparator from "./buttonSeparator";
import Error from "./error";
import Footer from "./footer";
import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ThemeContext from "./themeContext";
import { useGoogleLogin } from "@react-oauth/google";

axios.defaults.baseURL = "https://quitmate-api.fly.dev";
axios.defaults.withCredentials = true;

const Button = buttonAndSeparator.GoogleButton;
const Separator = buttonAndSeparator.Separate;

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectMain, setRedirectMain] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [autofill, setAutofill] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    axios
      .get("https://quitmate-api.fly.dev/signout")
      .then(() => setSignedOut(true));
  }, []);

  const signin = useGoogleLogin({
    onSuccess: (response) => {
      const token = response["access_token"];
      console.log(response);
      axios
        .post(`https://quitmate-api.fly.dev/signin`, { token })
        .then((response) => {
          let errorMsg = response.data;
          setError(errorMsg);
          if (errorMsg === "") {
            setRedirectMain(true);
          }
        });
    },
  });

  useEffect(() => {
    if (theme === "light") {
      setAutofill("autofill");
      setPlaceholder("placeholder");
    } else {
      setAutofill("autofill-dark");
      setPlaceholder("placeholder-dark");
    }
  }, [theme]);

  function sendForm(e) {
    e.preventDefault();
    axios
      .post("https://quitmate-api.fly.dev/signin", { username, password })
      .then((response) => {
        let errorMsg = response.data;
        setError(errorMsg);
        if (errorMsg === "") {
          setRedirectMain(true);
        }
      });
  }

  function demo() {
    axios.get("https://quitmate-api.fly.dev/demo-user").then((res) => {
      setUsername("demo_user");
      setPassword(res.data["demo"]);
    });
  }

  if (redirectMain) {
    return <Navigate to="/" />;
  }

  if (signedOut) {
    return (
      <>
        <Nav />
        <div className=" flex gap-5 ">
          <LeftPart
            text={
              '"Every day without a cigarette is a step towards a healthier you"'
            }
          />
          <div className=" p-[30px] h-1/2 lg:h-screen lg:w-[50vw] lg:shadow-form w-screen absolute right-0 top-0 flex flex-col gap-5 ">
            <form className=" mt-20 lg:mt-[10%] flex flex-col items-center gap-2 lg:gap-[30px] ">
              <Button text="Sign in with Google" onclick={() => signin()} />
              <Separator />
              <div className=" flex flex-col gap-2 lg:gap-4">
                <div className=" relative p-[13px] ">
                  <input
                    required
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${autofill}`}
                  />
                  <span className={placeholder}>Username</span>
                </div>
                <div className=" relative p-[13px] ">
                  <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${autofill}`}
                  />
                  <span className={placeholder}>Password</span>
                </div>
              </div>
              <Error error={error} />
              <button
                type="submit"
                className="w-11/12 lg:w-3/5 h-[50px] lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
                onClick={sendForm}
              >
                Sign In
              </button>
              <button
                type="button"
                id="demo"
                className="w-11/12 lg:w-3/5 h-[50px] lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
                onClick={demo}
              >
                Demo user
              </button>
            </form>
            <p className=" text-center text-lg lg:text-xl ">
              Don't have an account yet?{" "}
              <a href="/signup" className=" text-green-600">
                Sign up
              </a>
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default SignIn;
