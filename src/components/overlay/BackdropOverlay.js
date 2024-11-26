
import React from "react";

const BackdropOverlay = () => {
  return <div style={{
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(8px)", 
    zIndex: "999",
}}></div>;
};

export default BackdropOverlay;
