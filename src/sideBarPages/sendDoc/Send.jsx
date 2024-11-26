import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../firestore/firestore";
import { addDoc, collection, Timestamp, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import { TextField } from "@mui/material";
import "./styles.css";
import axios from "axios";
import emailjs from "emailjs-com";
import { toast } from "sonner";
import cuid from "cuid";
import {
  getStorage,
  ref as Storage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import SendDepartment from "./SendDepartment";
import SendEmail from "./SendEmail";
import { IoClose } from "react-icons/io5";

const Send = ({ onClose, file }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileUrl = file?.fields?.download_url;
  const fileName = file?.fields?.name;
  const fileId = file?.pk;
  const documentId = file?.fields?.document_id;

  const [selectedOption, setSelectedOption] = useState("Unsigned Documents");
  const [postData, setPostData] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const renderSelectedComponent = () => {
    // Props object to pass common props easily
    const commonProps = { file, fileName, fileUrl, fileId };

    switch (selectedOption) {
      case "Signed Documents":
        return <SendDepartment {...commonProps} />;
      case "Sent Documents":
        return <SendEmail {...commonProps} />;
      default:
        return <SendEmail {...commonProps} />;
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
          <div
            role="status"
            class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
          >
            <svg
              aria-hidden="true"
              class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 ml-6 mb-6">
        <div className="mx-auto max-w-3xl px-12 lg:px-8">
          <div
            style={{ backgroundColor: "#EBF6FF" }}
            className="w-full rounded-2xl border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700"
          >
            <div className="flex flex-col mt-1">
              <div className="flex justify-between ">
                
                <div className="text-black mt-0 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800  dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-xl text-sm py-2.5 font-body">
                  <button
                    className={`bg-white text-purple-900 font-medium border-pink-950 px-4 py-2 rounded-lg ${
                      selectedOption === "Signed Documents"
                        ? "border-3 border-purple-950"
                        : ""
                    }`}
                    onClick={() => setSelectedOption("Signed Documents")}
                  >
                    Send to Departments
                  </button>
                  <button
                    className={` ml-4 bg-white text-purple-900 font-medium border-pink-950 px-4 py-2 rounded-lg ${
                      selectedOption === "Sent Documents"
                        ? "border-3 border-purple-950"
                        : ""
                    }`}
                    onClick={() => setSelectedOption("Sent Documents")}
                  >
                    Send to Emails
                  </button>
                </div>
                <div>
                  <button className="px-2" onClick={onClose}>
                    <IoClose size={25} />
                  </button>
                </div>
              </div>
              <div className="relative flex items-center bg-white p-4 rounded-lg">
                <div className="w-full flex flex-col">
                  <div className="flex-grow overflow-auto ">
                    {renderSelectedComponent()}
                  </div>
                </div>
              </div>
            </div>
            {/* <button
              className="text-white mt-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
              style={{ backgroundColor: "#6254B6", marginLeft: "75%" }}
              onClick={onClose}
            >
              Cancel
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default Send;