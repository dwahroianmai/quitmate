import axios from "axios";
import { Navigate } from "react-router-dom";

function LogOut() {
  axios
    .get("https://quitmate-api.onrender.com/signout")
    .then((response) => console.log(response));

  return <Navigate to="/signin" />;
}

export default LogOut;
