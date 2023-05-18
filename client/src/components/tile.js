function Tile({ text, data, tailwind, click, textProps }) {
  return (
    <div
      className={`flex flex-col items-center justify-start text-xl p-[20px] rounded-[10px] shadow-tile ${tailwind} `}
      onClick={click}
    >
      <h4 className=" text-lg lg:text-xl font-semibold text-center">{text}</h4>
      <p className={textProps}>{data}</p>
    </div>
  );
}

export default Tile;
