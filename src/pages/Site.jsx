import React, { useEffect } from "react";
import { getTokenFromLocalStorage } from "../session";

const Site = ({ children }) => {
  useEffect(() => {
    const accessToken = getTokenFromLocalStorage();
    if (!accessToken) {
      window.location.href = "/login";
    }
  }, []);
  return <>{children}</>;
};

export default Site;
