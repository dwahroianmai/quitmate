import { useContext, useEffect, useState } from "react";
import ThemeContext from "./themeContext";

function HealthTileAll({ healthImprovement, percent }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [border, setBorder] = useState("");
  const [fill, setFill] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setBorder("border-green-900");
      setFill("bg-green-900");
    } else {
      setBorder("border-green-600");
      setFill("bg-green-600");
    }
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-start text-xl p-[20px] rounded-[10px] shadow-tile w-full lg:w-[50vw] lg:h-[200px]">
      <div className=" flex flex-col p-[10px] items-center lg:w-[80%] gap-[10px]  ">
        <p className=" text-center text-lg lg:text-xl">{healthImprovement}</p>
        <div className=" w-full flex items-center gap-[30px] ">
          <p className="text-lg">{`${percent}%`}</p>
          <div
            className={` w-full h-[18px] lg:h-[20px] border-[1px] ${border} rounded-[10px]`}
          >
            <div
              className={` h-full ${fill} rounded-[7px]`}
              style={{ width: percent + "%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTileAll;
