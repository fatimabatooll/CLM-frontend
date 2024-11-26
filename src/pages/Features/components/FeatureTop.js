import React from "react";
import Featurebtn from "./Featurebtn";
import PdfEdit from "./PdfEdit";

const FeatureTop = () => {
  const featureBtnStyle = {
    position: "absolute",
    top: "18.5rem",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500 opacity-60"></div>
      <img
        src="https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/pictures/editor/editor-intro-bg.jpg"
        className="w-100 h-80 object-cover"
        alt="Description of the image"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-4xl font-bold">Online PDF Editor</h1>
        <p>
          Annotate documents, whiteout text, append pages, merge files, add
          fields and more
        </p>
      </div>
      <div style={featureBtnStyle}>
        <Featurebtn />
      </div>
    </div>
  );
};

export default FeatureTop;