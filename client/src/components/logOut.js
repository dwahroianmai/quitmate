import axios from "axios";
import { Navigate } from "react-router-dom";

function LogOut() {
  axios
    .get("http://127.0.0.1:5000/signout")
    .then((response) => console.log(response));

  return <Navigate to="/signin" />;
}

export default LogOut;
