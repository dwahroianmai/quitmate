import SignIn from "./components/signin";
import SignUp from "./components/signup";
import SmokeData from "./components/smokeData";
import PrivateComponent from "./components/privateRoute";
import LogOut from "./components/logOut";
import Dashboard from "./components/dashboard";
import Health from "./components/healthAll";
import Settings from "./components/settings";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeContext from "./components/themeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    localStorage.getItem("mode")
      ? setTheme(localStorage.getItem("mode"))
      : setTheme("light");
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId="108832833179-c6tms36sj0ijd6mm84p0jkd4rpi0nomm.apps.googleusercontent.com">
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <div id="content" className={theme}>
            <Router>
              <Routes>
                <Route path="/signin" Component={SignIn} />
                <Route path="/signup" Component={SignUp} />
                <Route
                  path="/"
                  element={<PrivateComponent component={Dashboard} />}
                />
                <Route
                  path="/userdata"
                  element={<PrivateComponent component={SmokeData} />}
                />
                <Route
                  path="/health"
                  element={<PrivateComponent component={Health} />}
                />
                <Route
                  path="/settings"
                  element={<PrivateComponent component={Settings} />}
                />
                <Route path="/signout" Component={LogOut} />
              </Routes>
            </Router>
          </div>
        </ThemeContext.Provider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
