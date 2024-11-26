import React, { useState } from "react";
import Inbox from "./Inbox/Inbox";
import ReceiveDoc from "./receiveDoc/RecieveDoc";
import SignedDocuments from "./signedDoc/SignedDocuments";

function Inboxed() {
  const [selectedOption, setSelectedOption] = useState("Unsigned Documents");
  
  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case "Unsigned Documents":
        return <Inbox />;
      case "Signed Documents":
        return <SignedDocuments />;
      case "Sent Documents":
        return <ReceiveDoc />;
      default:
        return <Inbox />;
    }
  };

  return (
    <div className="inboxed w-full flex flex-col">
      <div className="flex justify-evenly items-center p-4" style={{ backgroundColor: "#EBF6FF", position: "relative", top: "30px", color: "#6254B6", borderColor: "#6254B6" }}>
        <div className="gap-4 flex ml-6">
          <button className={`bg-white text-purple-900 font-medium border-purple-950 px-4 py-2 rounded-xl ${selectedOption === "Unsigned Documents" ? "border-3 border-purple-950 " : ""}`} onClick={() => setSelectedOption("Unsigned Documents")}>
            Unsigned Documents
          </button>
          <button className={`bg-white text-purple-900 font-medium border-purple-950 px-4 py-2 rounded-xl ${selectedOption === "Signed Documents" ? "border-3 border-purple-950" : ""}`} onClick={() => setSelectedOption("Signed Documents")}>
            Signed Documents
          </button>
          <button className={`bg-white text-purple-900 font-medium border-purple-950 px-4 py-2 rounded-xl ${selectedOption === "Sent Documents" ? "border-3 border-purple-950" : ""}`} onClick={() => setSelectedOption("Sent Documents")}>
            Sent Documents
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">{renderSelectedComponent()}</div>
    </div>
  );
}

export default Inboxed;
