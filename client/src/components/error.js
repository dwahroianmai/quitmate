function Error({ error }) {
  if (error !== "") {
    return (
      <div className="border-2 border-red-600 rounded-[10px] p-[10px] ">
        <p className=" text-center">{error}</p>
      </div>
    );
  }
  return null;
}

export default Error;
