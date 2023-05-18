import Nav from "./nav";
import Setting from "./setting";
import Footer from "./footer";
import remove from "../img/trash-outline.svg";
import password from "../img/key-outline.svg";
import watch from "../img/time-outline.svg";
import globe from "../img/earth-outline.svg";
import { useEffect, useState } from "react";
import Time from "./resetTime";
import Currency from "./resetCurrency";
import Password from "./changePassword";
import Remove from "./removeUser";
import axios from "axios";

function Settings() {
  const [show, setShow] = useState("");
  const [component, setComponent] = useState(null);
  const [ifGoogleUser, setIfGoogleUser] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/ifgoogleuser").then((res) => {
      setIfGoogleUser(res["data"]["google_user"]);
    });
  }, []);

  function resetTime() {
    setShow("hidden");
    setComponent(() => <Time f={close} />);
  }

  function resetCurrency() {
    setShow("hidden");
    setComponent(() => <Currency f={close} />);
  }

  function changePassword() {
    setShow("hidden");
    setComponent(<Password f={close} />);
  }

  function deleteAccount() {
    setShow("hidden");
    setComponent(() => <Remove f={close} />);
  }

  function close() {
    setComponent(null);
    setShow("");
  }

  return (
    <div className="w-screen h-screen">
      <Nav />
      <div
        className={`flex flex-col gap-[15px] lg:gap-[20px] items-start w-[320px] ml-auto mr-auto mt-10 shadow-inset rounded-[10px] p-[15px] lg:p-[20px] ${show}`}
      >
        <Setting img={watch} setting="Reset time" f={resetTime} />
        <Setting img={globe} setting="Change currency" f={resetCurrency} />
        {ifGoogleUser ? null : (
          <Setting
            img={password}
            setting="Change password"
            f={changePassword}
          />
        )}
        <Setting img={remove} setting="Delete account" f={deleteAccount} />
      </div>
      {component}
      <Footer />
    </div>
  );
}

export default Settings;
