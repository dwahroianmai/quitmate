import { useEffect, useContext, useState } from "react";
import ThemeContext from "./themeContext";

function HealthTile({ text, data, tailwind, textProps, healthText, width }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [border, setBorder] = useState("");
  const [bg, setBg] = useState("");

  useEffect(() =>
    document.querySelector("#bar").setAttribute("style", `width: ${width}%`)
  );

  useEffect(() => {
    if (theme === "light") {
      setBorder("");
      setBg("");
    } else {
      setBorder("dark-border");
      setBg("dark-bg");
    }
  }, [theme]);

  return (
    <div
      className={`flex flex-col items-center justify-start text-xl p-[20px] rounded-[10px] shadow-tile ${tailwind} `}
    >
      <a href="/health">
        <h5 className=" absolute right-2 top-2 lg:top-4 lg:right-4 text-sm lg:text-base hover:cursor-pointer hover:text-green-600 active:text-black">
          Show all
        </h5>
      </a>
      <h4 className=" font-semibold text-lg lg:text-xl ">{text}</h4>
      <p className={textProps}>{data}</p>
      <div className=" flex flex-col p-[10px] items-center gap-[10px]  ">
        <p className=" text-center">{healthText}</p>
        <div className=" w-full flex items-center gap-[30px] ">
          <p className="text-xl">{`${width}%`}</p>
          <div
            className={`w-full h-[30px] border-[2px] border-green-900 rounded-[10px] ${border}`}
          >
            <div
              className={` h-full bg-green-900 rounded-[7px] ${bg}`}
              id="bar"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTile;
