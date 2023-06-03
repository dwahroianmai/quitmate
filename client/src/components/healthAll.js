import Nav from "./nav";
import HealthTileAll from "./healthAllTile";
import healthImprovements from "./healthImprovements";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./footer";

function Health() {
  const [data, setData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [times, setTimes] = useState(Object.keys(healthImprovements));
  const [healthState, setHealthState] = useState(
    Object.values(healthImprovements)
  );

  useEffect(() => {
    axios
      .get("https://quitmate-api.fly.dev/data")
      .then((res) => setData(res.data["data"]));
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(
      () => setElapsed(Date.now() - new Date(data[1]) + 2 * 60 * 60 * 1000),
      1000
    );
    return () => clearInterval(timeInterval);
  });

  function timePassed(time, usersTime) {
    let percent = time / 100;
    let usersPercent = usersTime / percent;
    return usersPercent;
  }

  function ifHundred(percent) {
    if (percent >= 100) {
      return 100;
    }
    return Math.round(percent);
  }

  return (
    <div className=" flex flex-col items-center h-full">
      <Nav settings="Settings" />
      <div className=" flex flex-col gap-[15px] items-center h-[80vh] lg:w-auto w-[90vw] overflow-y-scroll p-[15px] lg:p-[20px] shadow-inset rounded-[10px] mt-4">
        {healthState.map((state, i) => (
          <HealthTileAll
            key={i}
            healthImprovement={state}
            percent={`${ifHundred(timePassed(times[i], elapsed))}`}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Health;
