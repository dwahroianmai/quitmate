import { useContext } from "react";
import ThemeContext from "./themeContext";

function Achievement({ icon, achievement, done, done_img }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className=" flex items-center justify-between p-[10px] ">
      <div className=" flex gap-2 items-center">
        {done ? (
          theme === "light" ? (
            <img
              src={done_img}
              alt="done"
              className="done h-[40px] lg:h-[50px]"
            ></img>
          ) : (
            <img
              src={done_img}
              alt="done"
              className=" h-[40px] lg:h-[50px] dark-green"
            ></img>
          )
        ) : theme === "light" ? (
          <img
            src={done_img}
            alt="not done"
            className=" h-[40px] lg:h-[50px]"
          ></img>
        ) : (
          <img
            src={done_img}
            alt="not done"
            className=" h-[40px] lg:h-[50px] logo-white"
          ></img>
        )}
        <p className=" text-lg lg:text-2xl">{achievement}</p>
      </div>
      {theme === "light" ? (
        <img className=" h-[40px] lg:h-[50px]" src={icon} alt="icon"></img>
      ) : (
        <img
          className=" h-[40px] lg:h-[50px] logo-white"
          src={icon}
          alt="icon"
        ></img>
      )}
    </div>
  );
}

export default Achievement;
