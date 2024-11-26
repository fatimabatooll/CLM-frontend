import React, { useState } from "react";
import DisplayFolder from "./DisplayFolder";
import CreateEditLabel from "../labelCycle/CreateEditLabel";

const Folders = () => {
  const [selectedOption, setSelectedOption] = useState("Folders");
  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "Folders":
        return <DisplayFolder />;
      case "Labels":
        return <CreateEditLabel />;
      default:
        return <DisplayFolder />;
    }
  };
  return (
    <div className="w-full  flex flex-col">
      <div
        className=" p-4 flex justify-evenly items-center"
        style={{
          backgroundColor: "#EBF6FF",
          color: "#6254B6 ",

          borderColor: "#6254B6",
        }}
      >
        <div className="ml-2 mt-3 flex gap-4">
          <button
            className={`${
              selectedOption === "Folders"
                ? "bg-white border-purple-950 border-3 text-purple  border-fuchsia-200"
                : " bg-white text-purple-900"
            } font-medium border-purple-950	px-12 py-2 rounded-xl`}
            onClick={() => setSelectedOption("Folders")}
          >
            Folders
          </button>
          <button
            className={`${
              selectedOption === "Labels"
                ? "bg-white border-purple-950 border-3 text-purple  border-fuchsia-200"
                : " bg-white text-purple-900"
            } font-medium border-purple-950	px-12 py-2 rounded-xl`}
            onClick={() => setSelectedOption("Labels")}
          >
            Labels
          </button>
        </div>
      </div>
      <div className="flex-grow ">{renderSelectedComponent()}</div>
    </div>
  );
};
export default Folders;
