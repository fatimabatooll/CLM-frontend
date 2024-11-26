import React, { useState, useEffect } from "react";
import "@wukla/react/styles.css";
import { DocumentEditor } from "@wukla/react/editor";
import { useMeasure } from "react-use";
import { createDocument } from "./document"; // Import createDocument instead of document
import axios from "axios";
import { firestore } from "../../../firestore/firestore";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc as firestoreDoc, // Rename doc to avoid conflict
  updateDoc,
} from "firebase/firestore"; // Rename doc to avoid conflict
import { serverTimestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DocumentFieldType,
  DocumentStatus,
  SignerVerificationType,
} from "./Graphql";

const EmailSending = () => {
  const [responseData, setResponseData] = useState(null);
  const location = useLocation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLines, setEmailLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const postData = location.state?.postData;
  const file = location.state?.file;
  const tokenNumber = location.state?.tokenNumber;

  const documentId = location.state?.doc;
  const fileUrl = file?.fileUrl;
  const download_url = file?.fields?.download_url;

  console.log(tokenNumber);
  const fileName = file?.fields?.name;
  const fileId = file?.pk;

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  useEffect(() => {
    const fetchDocumentData = async () => {
      const documentId = localStorage.getItem("document_id");
      console.log("document id in email sending is:", documentId);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/file/get-document/`,
          { documentId }
        );
        setResponseData(response.data.data.getDocument);
        console.log(
          response.data.data.getDocument,
          "responseData is given as://////"
        );
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };
    fetchDocumentData();
  }, []);

  const document = responseData ? createDocument(responseData, postData) : null;
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [ref, { height, width }] = useMeasure();
  if (!document) {
    return <div>Loading...</div>; // Add a loading state
  }

  const handleUpdateDocument = async (data) => {
    console.log(data);
    const recipients = postData.recipients.map((recipient) => ({
      email: recipient.email,
      id: recipient.id,
      name: recipient.name,
      phone: "+923401127161",
      verification: SignerVerificationType.None,
    }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/send_document/?documentId=${data.id}`,
        {
          recipientIds: data.recipients.map((recipient) => recipient.id),
          recipients: data.recipients.map((recipient) => ({
            id: recipient.id,
            name: recipient.name,
            email: recipient.email,
            verification: recipient.verification,
          })),
          title: data.title,
          fields: data.fields.map((field, index) => ({
            id: field.id,
            recipientId: field.recipientId,
            label: field.label,
            type: field.type,
            page: field.page,
            height: field.height,
            width: field.width,
            x: field.x,
            y: field.y,
          })),
          meta: [
            {
              ordered: data.meta ? data.meta.ordered : false,
              defaultFontSize: data.meta ? data.meta.defaultFontSize : 0,
              signatureFontSize: data.meta ? data.meta.signatureFontSize : 0,
              textFontSize: data.meta ? data.meta.textFontSize : 0,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Success:", response.data);
        toast.success("File sent successfully");
        navigate("/inboxed");
      } else {
        console.error("Request failed with status:", response.status);
        setErrorMessage(
          `Request failed with status code ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
      try {
        if (tokenNumber) {
          // Fetch document data from Firestore
          const querySnapshot = await getDocs(
            query(
              collection(firestore, "sendData"),
              where("tokenNumber", "==", tokenNumber)
            )
          );
    
          if (!querySnapshot.empty) {
            const documentData = querySnapshot.docs[0].data();
            let { addUserEmails } = documentData;
    
            const sentTime = new Date().toISOString();
            const date = new Date(sentTime);
            const options = {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZone: "UTC",
              timeZoneName: "short",
            };
            const formattedDate = date.toLocaleDateString("en-US", options);            addUserEmails = addUserEmails.map((user) => {
              if (
                user.hasOwnProperty("document_id") &&
                user.document_id === data.id
              ) {
                return {
                  ...user,
                  status: "Pending",
                  sentTime: formattedDate,

                  
                };
              }
              return user;
            });
    
            const documentRef = firestoreDoc(
              firestore,
              "sendData",
              querySnapshot.docs[0].id
            );
            await updateDoc(documentRef, { addUserEmails });
    
            console.log("User status updated successfully to 'Pending'");
          } else {
            console.error("Document not found for tokenNumber:", tokenNumber);
          }
        } else {
          // Execute logic when tokenNumber is null
          const recipients = postData.recipients.map((recipient) => ({
            email: recipient.email,
            id: recipient.id,
            name: recipient.name,
            phone: "+923401127161",
            verification: SignerVerificationType.None,
          }));
    
          const sentTime = new Date().toISOString();
          const date = new Date(sentTime);
          const options = {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            timeZone: "UTC",
            timeZoneName: "short",
          };
          const formattedDate = date.toLocaleDateString("en-US", options);
          const firebaseData = {
            senderemail: user.email,
            addUserEmails: recipients.map((recipient) => ({
              ...recipient,
              status: "Pending",
              sentTime: formattedDate,
            })),
            requestedTime: serverTimestamp(),
            uid: user.id,
            document_id: data.id,
            download_url,
            fileName,
            owner: `${user.first_name} ${user.last_name}`,
          };
    
          const docRef = await addDoc(
            collection(firestore, "sendData"),
            firebaseData
          );
          console.log("Firebase document written with ID: ", docRef.id);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
    };
  return (
    <DocumentEditor.Root document={document}>
      <div className="flex gap-4 p-4">
        <div className="fixed inset-0 h-screen w-screen" ref={ref}>
          {height > 0 && (
            <DocumentEditor.Canvas
              dimensions={{
                height,
                width,
              }}
            />
          )}
        </div>
        <DocumentEditor.SideBar
          onSubmit={(data) => {
            console.log("onSubmit", data);
            handleUpdateDocument(data);
          }}
          onSend={handleUpdateDocument} // Change this line to call handleSend onSend button click
          className="fixed shadow-2xl right-4 top-4 max-h-[600px] bg-white rounded-lg border border-gray-200"
        />
      </div>
    </DocumentEditor.Root>
  );
};
export default EmailSending;
