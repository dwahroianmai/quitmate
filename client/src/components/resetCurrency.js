import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import close from "../img/close-outline.svg";
import ThemeContext from "./themeContext";

function Currency({ f }) {
  const [currencies, setCurrencies] = useState([]);
  const [currency, setCurrency] = useState("");
  const [symbol, setSymbol] = useState("");
  const [message, setMessage] = useState(
    "Please, select new currency. Your saved money will be converted."
  );
  const [changed, setChanged] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const [closeColor, setCloseColor] = useState("");
  const [bg, setBg] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setCloseColor("");
      setBg("bg-white");
    } else {
      setBg("bg-black");
      setCloseColor("logo-white");
    }
  }, [theme]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      setCurrencies(
        filterCur(
          res.data.map((c) => c["currencies"]).filter((c) => c !== undefined)
        )
      );
    });
  }, []);

  function filterCur(arr) {
    let filtered = [];
    arr.forEach((elem) => {
      if (
        !filtered.map((c) => Object.keys(c)[0]).includes(Object.keys(elem)[0])
      ) {
        filtered.push(elem);
      }
    });
    filtered.sort((a, b) => (Object.keys(a)[0] < Object.keys(b)[0] ? -1 : 1));
    return filtered;
  }

  function resetCurrency(e) {
    e.preventDefault();
    axios
      .post("https://quitmate-api.fly.dev/resetcurrency", {
        currency,
        symbol,
      })
      .then(() => {
        setMessage("Currency was changed.");
        setChanged(true);
      });
  }

  if (!changed) {
    return (
      <div className="flex flex-col gap-[20px] items-start w-[90%] lg:w-[570px] ml-auto mr-auto mt-10 shadow-inset rounded-[10px] p-[20px] relative">
        <h4 className="text-2xl hover:cursor-default text-start">{message}</h4>
        <img
          src={close}
          alt="close"
          className={`absolute right-3 top-3 h-[30px] hover:scale-150 active:scale-100 ${closeColor}`}
          onClick={f}
        ></img>
        <form className="flex flex-col gap-[20px] items-start w-full lg:w-[570px]">
          <select
            className=" outline-green-600 rounded-[10px] p-[12px] bg-transparent w-[300px] border-[2px] border-green-600"
            onChange={(e) => {
              setCurrency(e.target.value);
              setSymbol(e.target.selectedOptions[0].dataset["symbol"]);
              console.log(
                e.target.value,
                e.target.selectedOptions[0].dataset["symbol"]
              );
            }}
            defaultValue=""
            name="currency"
          >
            <option className={`${bg}`}>New currency</option>
            {currencies.map((c) => {
              return (
                <option
                  className={`${bg}`}
                  key={Object.keys(c)[0]}
                  value={Object.keys(c)[0]}
                  data-symbol={c[Object.keys(c)[0]]["symbol"]}
                >
                  {Object.keys(c)[0]}
                </option>
              );
            })}
          </select>
          <button
            className=" self-center p-1 lg:p-0 w-3/5 lg:h-[60px] appearance-none text-xl bg-transparent rounded-[10px] border-solid border-2 border-green-600 hover:scale-[1.05] active:scale-100 transition duration-300"
            onClick={resetCurrency}
          >
            Change currency
          </button>
        </form>
      </div>
    );
  }

  return <Navigate to="/" />;
}

export default Currency;
