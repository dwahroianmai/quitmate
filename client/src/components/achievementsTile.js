import achievements from "./achievements";
import timer from "../img/timer-outline.svg";
import cash from "../img/cash-outline.svg";
import cigarette from "../img/4109338.png";
import done from "../img/checkmark-circle-outline.svg";
import done_filled from "../img/checkmark-circle.svg";
import Achievement from "./achievement";
import { useState, useEffect } from "react";

function AchievementTile({ elapsed, avoided, saved, currency }) {
  const [achieved, setAchieved] = useState(0);
  const [all, setAll] = useState(achievements.length);

  useEffect(() => {
    setAchieved(
      achievements.filter(
        (a) =>
          (a[0] === "time" && a[1] <= elapsed) ||
          (a[0] === "avoided" && a[1] <= avoided) ||
          (a[0] === "saved" && a[1] <= saved)
      ).length
    );
  }, [elapsed, avoided, saved]);

  return (
    <div className="flex flex-col items-center justify-start text-xl p-[20px] rounded-[10px] shadow-tile col-start-1 col-end-5 row-start-3 row-end-5 lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-5">
      <div className="h-[429px]">
        <h4 className=" font-semibold text-lg lg:text-xl text-center">
          Your achievements {`(${achieved} / ${all})`}
        </h4>
        <div className=" max-h-96 overflow-y-scroll">
          {achievements.map((a, i) => {
            if (a[0] === "time") {
              if (a[1] <= elapsed) {
                return (
                  <Achievement
                    key={i}
                    icon={timer}
                    achievement={a[2]}
                    done={true}
                    done_img={done_filled}
                  />
                );
              } else {
                return (
                  <Achievement
                    key={i}
                    icon={timer}
                    achievement={a[2]}
                    done={false}
                    done_img={done}
                  />
                );
              }
            } else if (a[0] === "avoided") {
              if (a[1] <= avoided) {
                return (
                  <Achievement
                    key={i}
                    icon={cigarette}
                    achievement={a[2]}
                    done={true}
                    done_img={done_filled}
                  />
                );
              } else {
                return (
                  <Achievement
                    key={i}
                    icon={cigarette}
                    achievement={a[2]}
                    done={false}
                    done_img={done}
                  />
                );
              }
            } else if (a[0] === "saved") {
              if (a[1] <= saved) {
                return (
                  <Achievement
                    key={i}
                    icon={cash}
                    achievement={`${a[2]} ${currency}.`}
                    done={true}
                    done_img={done_filled}
                  />
                );
              } else {
                return (
                  <Achievement
                    key={i}
                    icon={cash}
                    achievement={`${a[2]} ${currency}.`}
                    done={false}
                    done_img={done}
                  />
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default AchievementTile;
