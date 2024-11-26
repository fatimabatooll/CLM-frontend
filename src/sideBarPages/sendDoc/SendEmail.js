
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
import cuid from 'cuid';
import { getStorage, ref as Storage, uploadBytes, getDownloadURL } from "firebase/storage";

const SendEmail = ({ onClose, file }) => {
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
  const [emailLines, setEmailLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [postData, setPostData] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const EMAILJS_USER_ID = "qw4I1NBEsOmRb3kZT";
  const EMAILJS_SERVICE_ID = "service_jjzd7dn";
  const EMAILJS_TEMPLATE_ID = "template_rz0q7sp";
  emailjs.init(EMAILJS_USER_ID);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInputValue = inputValue.trim();
      if (trimmedInputValue === "") {
        setErrorMessage("Please enter an email address");
      } else if (isValidEmail(trimmedInputValue)) {
        setEmailLines([...emailLines, trimmedInputValue + "\n"]);
        setInputValue("");
        handleAddUser(trimmedInputValue);
        setErrorMessage("");
      } else {
        setErrorMessage("Please enter a valid email address");
      }
    }
  };

  const sendEmail = (emailObj) => {
    const templateParams = {
      to_email: emailObj,
      from_name: user.first_name,
      from_email: user.email,
    };
    console.log(templateParams);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  };
  const handleChipDelete = (emailToDelete) => {
    setEmailLines((prevEmailLines) =>
      prevEmailLines.filter((email) => email !== emailToDelete)
    );
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user !== emailToDelete.trim())
    );
    setUserPermissions((prevUserPermissions) =>
      prevUserPermissions.filter(
        (permission) => permission.email !== emailToDelete.trim()
      )
    );
  };
  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);
  const handleAddUser = (emailObj) => {
    console.log(emailObj, "emailObj");
    if (emailObj) {
      setUsers([...users, emailObj]);
      setUserPermissions([
        ...userPermissions,
        { email: emailObj, permission: "read" },
      ]);
      setNewUser("");
    }
  };
  
  const handleSend = async () => {
    if (users.length === 0) {
      setErrorMessage(
        "Please enter at least one email address before sending."
      );
      return;
    }
    setIsLoading(true);
    const recipients = users.map((email) => ({
      id: cuid(),
      name: email.split("@")[0],
      email: email,
      verification: "none",
    }));
    console.log("here is the file url", fileUrl)
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob(); 
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      const formData = new FormData();
      formData.append('file', new Blob([arrayBuffer], { type: 'application/pdf' }), 'file.pdf');
      const createDocumentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/file/create_document/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('here is the createDocumentResponse:', createDocumentResponse.data);
      if (createDocumentResponse.data.data && createDocumentResponse.data.data.createDocument.id) {
        const documentId = createDocumentResponse.data.data.createDocument.id;
        
        const uniqueFileName = `${Date.now()}_${file.name}`;
        const storage = getStorage();
        const storageRef = Storage(storage, `file/${uniqueFileName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const postData = {
          recipientIds: recipients.map((recipient) => recipient.id),
          recipients: recipients,
          file: {
            fileName: file.name,
            downloadURL: downloadURL,
            timestamp: Timestamp.fromDate(new Date()),
            documentId: documentId,
            account: user.id,
          },
        };
        setPostData(postData);
        localStorage.setItem("document_id", documentId);
        const url = downloadURL.split("googleapis.com")[1];
        const encodedURL = encodeURIComponent(url);
        const stateData = {
          postData: postData,
          doc: encodedURL,
          file: file,
        };
        navigate("/document", { state: stateData });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
      <div className="w-full p-4 bg-white border border-gray-200  sm:p-8 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col">
          <button className="text-black focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-md shadow-purple-200/50 border-1 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body">
            Sharing file: {fileName}
          </button>

          <div className="relative flex items-center mt-2 ">
            <div className="w-full h-auto">
              <TextField
                multiline
                rows={Math.max(3, emailLines.length)}
                placeholder="Enter emails..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                variant="outlined"
                style={{
                  height: 'auto',
                  width: "100%",
                  resize: "none",
                  color: errorMessage ? "red" : null,
                }}
              />
              {errorMessage && (
                <p className="text-red-600 font-body" style={{ color: "red" }}>
                  {errorMessage}
                </p>
              )}
            </div>
            <div className="absolute left-4 top-12 mb-4">
              {emailLines.map((email, index) => (
                <Chip
                  key={index}
                  avatar={<Avatar>{email.charAt(0)}</Avatar>}
                  label={email}
                  onDelete={() => handleChipDelete(email)}
                  color="primary"
                  variant="outlined"
                  className="mr-2 mb-1"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
          <button
          className="text-white  mt-2  focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
          style={{ backgroundColor: "#6254B6" }}
        onClick={handleSend}
      >
        Send
      </button>
      </div>
    </>
  );
};
export default SendEmail;