import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function PrivateComponent({ component }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/authorized").then((response) => {
      let respAuth = response.data["authorized"];
      setAuthorized(respAuth);
      setLoading(true);
    });
  }, []);

  if (!loading) {
    return <div>Loading...</div>;
  }

  if (authorized) {
    const Component = component;
    return <Component />;
  }
  return <Navigate to="/signin" />;
}

export default PrivateComponent;
