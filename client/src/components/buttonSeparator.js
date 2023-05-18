import googleLogo from "../img/google-logo.svg";
import "../styles.css";

function GoogleButton({ text, onclick }) {
  return (
    <>
      <button
        onClick={onclick}
        type="button"
        className="w-11/12 lg:w-3/5 h-14 appearance-none text-xl hover:scale-[1.05] bg-transparent rounded-[10px] border-solid border-2 border-green-600 active:scale-100 transition duration-300"
      >
        <div className=" flex items-center justify-center gap-[10px] ">
          <img src={googleLogo} alt="google logo" className=" h-8 " />
          <p className=" text-xl">{text}</p>
        </div>
      </button>
    </>
  );
}

function Separate() {
  return (
    <>
      <div className=" flex gap-[5px] items-center text-xl">
        <div className="separator"></div>
        <p>or</p>
        <div className="separator"></div>
      </div>
    </>
  );
}

const buttonAndSeparator = { GoogleButton, Separate };

export default buttonAndSeparator;
