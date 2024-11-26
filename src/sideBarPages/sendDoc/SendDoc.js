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
import { v4 as uuidv4 } from "uuid";
const SendDocModal = ({ onClose, file }) => {
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
  const [EmailList, setEmailList] = useState([]);
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
  useEffect(() => {
    const fetchEmailList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/departments/list_employees/`,
          {
            withCredentials: true,
          }
        );
        console.log("Fetched employees:", response.data);
        // Extracting email addresses and IDs from the response
        const employees = response.data || [];
        const emailList = employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          email: employee.email
        }));
        console.log("Here is the list of emails:", emailList);
        // Set the extracted email addresses and IDs in the state
        setEmailList(emailList);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmailList();
  }, []);
  const handleSend = async () => {
    console.log(EmailList);

    if (EmailList.length === 0) {
      setErrorMessage("Please fetch the list of users before sending.");
      return;
    }
    if (!fileUrl) {
      setErrorMessage("Please provide a valid file URL.");
      return;
    }
    setIsLoading(true);
    try {
      // Fetch the PDF file from the provided URL
      const response = await fetch(fileUrl);
      const blob = await response.blob(); // Convert the file to a Blob
      // Create a unique filename for the storage
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const tokenNumber = uuidv4();
      // Get Firebase Storage reference
      const storage = getStorage();
      const storageRef = Storage(storage, `sendData/${uniqueFileName}`);
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, blob);
      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      // Prepare recipients list with only email and id
      
      const recipients = EmailList.map(({ email, name }) => ({
        id: cuid(),
        email,
        name
    }));
          // Prepare postData with file and document information
      const postData = {
        recipientIds: recipients.map((recipient) => recipient.id),
        recipients: recipients,
        file: {
          fileName: file.name,
          downloadURL: downloadURL,
          timestamp: Timestamp.fromDate(new Date()),
          account: user.id,
        },
      };
      setPostData(postData);
      const url = downloadURL.split("googleapis.com")[1];
      const encodedURL = encodeURIComponent(url);
      // Send file to first recipient with status Pending
      const firstRecipient = recipients[0];
      const firebaseData = {
        senderemail: user.email,
        addUserEmails: recipients.map((r, index) => ({
          ...r,
          status: index === 0 ? "Pending" : "Not Sent",
        })),
        requestedTime: serverTimestamp(),
        uid: user.id,
        fileId: fileId,
        fileUrl,
        fileName,
        owner: `${user.first_name} ${user.last_name}`,
        tokenNumber: tokenNumber,
      };
      // Add data to Firestore
      const docRef = await addDoc(
        collection(firestore, "sendData"),
        firebaseData
      );
      console.log("Firestore document added with ID: ", docRef.id);
      // Send email to first recipient
      sendEmail(firstRecipient.email);
      // Close the modal
      onClose();
      // Show success alert
      toast.success("File sent successfully!");
      const stateData = {
        postData: postData,
        doc: encodedURL,
        file: file,
      };
      onClose();
      navigate("/inboxed");
      toast.success("File sent successfully!");

    } catch (error) {
      console.error("Error:", error);
      // Handle error
      setErrorMessage("Error sending document.");
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
            class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
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
      <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 ml-6 mt-6">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col">
              <button className="text-black mt-0 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body">
                Sharing file: {fileName}
              </button>
              <div className="flex ">
                  <div className="  top-4">
                  {EmailList.map((emailObj, index) => (
                    <Chip
                      key={index}
                      avatar={<Avatar>{emailObj.email.charAt(0)}</Avatar>}
                      label={emailObj.email}
                      // onDelete={() => handleChipDelete(emailObj.email)}
                      color="primary"
                      variant="outlined"
                      className="mr-2 mt-2 mb-1"
                    />
                  ))}
                </div>
                </div>
              </div>
          </div>
          <button
            className="text-white mt-2 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
            style={{ backgroundColor: "#1CA1D8" }}
            onClick={handleSend}>
            Send
          </button>
          <button
            className="text-white mt-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
            style={{ backgroundColor: "#1CA1D8", marginLeft: "10px" }}
            onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
export default SendDocModal;
