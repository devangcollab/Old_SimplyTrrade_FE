import React from "react";
import sideImage from "../assets/Group 18754.png";

const Illustration = () => {
  return (
    <img
      src={sideImage}
      alt="Illustration"
      style={{
        height: "100vh",
        width: "80%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    />
  );
};

export default Illustration;
