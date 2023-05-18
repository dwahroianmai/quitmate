import github from "../img/github-mark-white.svg";

function Footer() {
  return (
    <div className="w-screen flex justify-center bg-green-900 fixed z-[10000] bottom-0 p-[3px] lg:p-[5px]">
      <div className="flex gap-[15px] items-center">
        <p className="text-white">@dwahroianmai</p>
        <a href="https://github.com/dwahroianmai">
          <img
            src={github}
            alt="github-logo"
            className="h-[20px] lg:h-[30px]"
          ></img>
        </a>
      </div>
    </div>
  );
}

export default Footer;
