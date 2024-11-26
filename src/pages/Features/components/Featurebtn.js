import React from "react";

const Featurebtn = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <button className="bg-purple-800 text-white font-bold py-2 px-4 ">
          Edit PDFs
        </button>
        <button className="bg-gray-500 text-blue font-bold py-2 px-4 ">
          PDF Forms & Templates
        </button>
        <button className="bg-gray-500 text-blue font-bold py-2 px-4 ">
          Sign Documents
        </button>
      </div>
    </div>
  );
};

export default Featurebtn;