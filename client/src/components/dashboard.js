import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Tile from "./tile";
import Nav from "./nav";
import facts from "./facts";
import HealthTile from "./healthTile";
import healthImprovements from "./healthImprovements";
import Footer from "./footer";
import AchievementTile from "./achievementsTile";

function Dashboard() {
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fact, setFact] = useState(
    facts[Math.floor(Math.random() * facts.length)]
  );
  const [data, setData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [health, setHealth] = useState("");
  const [percent, setPercent] = useState(0);
  const [time, setTime] = useState("");
  const [saved, setSaved] = useState("");
  const [avoided, setAvoided] = useState("");

  // checks if there's already data in the db
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/userdata").then((res) => {
      setEmpty(res.data["empty"]);
      setLoading(true);
    });
  }, []);

  // gets user's data from db
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/data").then((res) => {
      console.log(res);
      setData(res.data["data"]);
    });
  }, []);

  // sets random fact
  useEffect(() => {
    const interval = setInterval(
      () => setFact(facts[Math.floor(Math.random() * facts.length)]),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  // set health progress
  useEffect(() => {
    for (let key in healthImprovements) {
      if (elapsed < key) {
        setHealth(healthImprovements[key]);
        setPercent(Math.round(timePassed(key, elapsed)));
        return;
      }
    }
  }, [elapsed]);

  // sets elapsed time in ms, adds two more hours for CEST timezone
  useEffect(() => {
    const timeInterval = setInterval(
      () => setElapsed(Date.now() - new Date(data[1]) + 2 * 60 * 60 * 1000),
      1000
    );
    return () => clearInterval(timeInterval);
  });

  // calculates, for how long user hasn't been smoking
  useEffect(() => {
    let d = parseInt(elapsed / 1000 / 60 / 60 / 24);
    let h = parseInt(elapsed / 1000 / 60 / 60 - d * 24);
    let m = parseInt(elapsed / 1000 / 60 - h * 60 - d * 24 * 60);
    let s = parseInt(elapsed / 1000 - m * 60 - h * 60 * 60 - d * 24 * 60 * 60);
    setTime(
      `${addS(d, "day")} : ${addS(h, "hour")} : ${addS(m, "minute")} : ${addS(
        s,
        "second"
      )}`
    );
  }, [elapsed]);

  // returns array with count of avoided cigarettes and saved money
  useEffect(() => {
    if (data) {
      let perDay = data[2];
      let price = data[3];
      let inPack = data[4];

      let hours = Math.round(24 / perDay);
      let avoidedCigs = parseInt(elapsed / 1000 / 60 / 60 / hours);
      let perCigarette = price / inPack;
      setAvoided(avoidedCigs);
      setSaved(`${avoidedCigs * perCigarette}`);
    }
  }, [data, elapsed]);

  function nextFact() {
    setFact(facts[Math.floor(Math.random() * facts.length)]);
  }

  // singular and plural for time periods
  function addS(number, word) {
    return number === 1 ? `${number} ${word}` : `${number} ${word}s`;
  }

  function timePassed(time, usersTime) {
    let percent = time / 100;
    let usersPercent = usersTime / percent;
    return usersPercent;
  }

  if (!loading) {
    return <div>Loading...</div>;
  }

  if (empty) {
    return <Navigate to="/userdata" />;
  }

  return (
    <div className="overflow-y-scroll flex flex-col items-center gap-8">
      <Nav settings="Settings" />
      <div
        id="dashboard"
        className=" w-[90vw] lg:w-[60vw] grid grid-cols-4 grid-rows-7 gap-[20px] relative z-[200] lg:max-h-[95vh] pb-10 lg:pb-14"
      >
        <Tile
          text="You haven't been smoking for:"
          tailwind=" col-start-1 col-end-5 lg:col-end-3 row-start-1 row-end-2 gap-[10px]"
          data={time}
          textProps="text-lg lg:text-2xl text-center"
        />
        <Tile
          text="You have saved:"
          tailwind="col-start-1 col-end-3 lg:col-end-2 row-start-2 row-end-3 gap-[10px]"
          data={`${Math.round(saved)} ${data[6]}`}
          textProps="text-lg lg:text-2xl"
        />
        <Tile
          text="You have avoided:"
          tailwind="col-start-3 col-end-5 lg:col-start-2 lg:col-end-3 row-start-2 row-end-3 gap-[10px]"
          data={
            avoided === 1 ? `${avoided} cigarette` : `${avoided} cigarettes`
          }
          textProps="text-lg lg:text-2xl text-center"
        />
        <Tile
          text="Fact about smoking:"
          tailwind="col-start-1 col-end-5 row-start-7 row-end-8 lg:row-start-5 lg:row-end-7 gap-[10px]"
          textProps="text-lg text-center"
          data={fact}
          click={nextFact}
        />
        <HealthTile
          text="Your health improvements:"
          tailwind=" col-start-1 col-end-5 row-start-5 row-end-7 lg:col-end-3 lg:row-start-3 lg:row-end-5 relative"
          healthText={health}
          width={percent}
        />
        <AchievementTile
          elapsed={elapsed}
          saved={saved}
          avoided={avoided}
          currency={data[6]}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
