import { useState, useEffect, useContext } from "react";
import Nav from "./nav";
import Footer from "./footer";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ThemeContext from "./themeContext";
import Error from "./error";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function SmokeData() {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [pack, setPack] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [sent, setSent] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [grey, setGrey] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [optionBg, setOptionBg] = useState("");
  const { theme, setTheme } = useContext(ThemeContext);
  const [error, setError] = useState("");

  useEffect(() => {
    if (theme === "light") {
      setPlaceholder("placeholder");
      setOptionBg("bg-white");
    } else {
      setPlaceholder("placeholder-dark");
      setOptionBg("bg-black");
    }
  }, [theme]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/authorized", { withCredentials: true })
      .then((response) => setUsername(response.data["username"]));
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/userdata").then((res) => {
      if (!res.data["empty"]) {
        setSent(true);
      }
    });
  }, []);

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

  function sendData(e) {
    e.preventDefault();
    let ms = new Date().getTime();
    if ((!checked && !date) || !price || !pack || !day || !currency) {
      setError("Please, set the date and fill out all other fields.");
    } else {
      if (checked) {
        let now = new Date(parseInt(ms) + 2 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        axios
          .post("http://127.0.0.1:5000/userdata", {
            date: now,
            day,
            pack,
            price,
            currency,
            symbol,
          })
          .then(setSent(true));
      } else {
        axios
          .post("http://127.0.0.1:5000/userdata", {
            date,
            day,
            pack,
            price,
            currency,
            symbol,
          })
          .then(setSent(true));
      }
    }
  }

  function check() {
    if (checked) {
      setChecked(false);
      setDisabled(false);
      setGrey("");
    } else {
      setChecked(true);
      setDisabled(true);
      setGrey("bg-slate-200");
    }
  }

  if (!sent) {
    return (
      <div className=" overflow-y-scroll">
        <Nav />
        <div className="p-[30px] flex justify-start flex-col items-center h-[80vh] mt-0 mb-0 ml-auto mr-auto rounded-[10px]">
          <p className=" text-center text-xl lg:w-[800px]">
            Welcome to QuitMate, {username}. We are glad you've decided to quit
            smoking and we are here to help you. Please answer some of our
            questions below.
          </p>
          <form className="mt-5 flex flex-col items-center gap-[30px] form-inputs pb-[60px] lg:p-0">
            <div className="flex flex-col items-center gap-[20px] ">
              <div className="flex gap-4 self-start ml-[13px] items-center">
                <input
                  type="checkbox"
                  name="now"
                  id="now"
                  className="h-[20px] w-[20px] accent-green-900 outline-green-900"
                  onChange={check}
                  checked={checked}
                />
                <p className="text-xl" onClick={check}>
                  I have just smoked.
                </p>
              </div>
              <div className="relative p-[13px]">
                <input
                  className={grey}
                  id="last_cig"
                  name="last_cig"
                  type="text"
                  onFocus={(e) => (e.target.type = "datetime-local")}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={disabled}
                />
                <span className={placeholder}>When you last smoked</span>
              </div>
              <div className=" relative p-[13px]">
                <input
                  required
                  id="cigs_daily"
                  name="cigs_daily"
                  type="number"
                  min="1"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
                <span className={placeholder}>Cigarettes per day</span>
              </div>
              <div className="relative p-[13px]">
                <input
                  required
                  id="in_a_pack"
                  name="in_a_pack"
                  type="number"
                  min="0"
                  step="5"
                  value={pack}
                  onChange={(e) => setPack(e.target.value)}
                />
                <span className={placeholder}>Cigarettes in one pack</span>
              </div>
              <div className="relative p-[13px]">
                <input
                  required
                  id="price_for_pack"
                  name="price_for_pack"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span className={placeholder}>Price for one pack</span>
              </div>
            </div>
            <select
              name="currency"
              className=" outline-green-600 rounded-[10px] p-[12px] bg-transparent w-[240px] lg:w-[300px] border-[2px] border-green-600"
              onChange={(e) => {
                setCurrency(e.target.value);
                setSymbol(e.target.selectedOptions[0].dataset["symbol"]);
              }}
              defaultValue=""
            >
              <option className={optionBg}>Select your currency</option>
              {currencies.map((c) => {
                return (
                  <option
                    key={Object.keys(c)[0]}
                    value={Object.keys(c)[0]}
                    data-symbol={c[Object.keys(c)[0]]["symbol"]}
                    className={optionBg}
                  >
                    {Object.keys(c)[0]}
                  </option>
                );
              })}
            </select>
            <Error error={error} />
            <button
              type="submit"
              className="w-[60%] h-[60px] appearance-none text-xl bg-transparent rounded-[10px]  border-2 border-green-600"
              onClick={sendData}
            >
              Send answers
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return <Navigate to="/" />;
}

export default SmokeData;
