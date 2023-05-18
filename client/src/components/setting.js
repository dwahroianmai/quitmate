import { useContext, useEffect, useState } from "react";
import ThemeContext from "./themeContext";

function Setting({ img, setting, f }) {
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
    <div className="flex gap-2 lg:gap-3 items-center" onClick={f}>
      <img src={img} alt="setting" className={`h-[30px] ${color}`}></img>
      <p className=" text-lg lg:text-2xl hover:text-green-600 active:text-black">
        {setting}
      </p>
    </div>
  );
}

export default Setting;
