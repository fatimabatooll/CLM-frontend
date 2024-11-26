import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firestore/firestore";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
const Iframe = () => {
  const iframeRef = useRef(null);
  const overlayRef = useRef(null);
  const location = useLocation();
  const documentId = new URLSearchParams(location.search).get("documentId");
  const signerName = new URLSearchParams(location.search).get("signerName");
  const signerEmail = new URLSearchParams(location.search).get("signerEmail");
  const tokenNumber = new URLSearchParams(location.search).get("tokenNumber");
  const [SignedLoading, setSignedLoading] = useState(false);
  const [signerHasSigned, setSignerHasSigned] = useState(false);
  const [SignedTime, setSignedTime] = useState(false);
  const [SignedDate, setSignedDate] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [hierarchyName, setHierarchyName] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { state: embedDocument } = useLocation();
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = embedDocument;
    }
  }, [embedDocument]);
  useEffect(() => {
    fetchDocumentDetails();
  }, []);
  const fetchDocumentDetails = async () => {
    try {
      // Create query conditionally based on available identifiers
      const queryConditions = tokenNumber
        ? query(collection(firestore, "sendData"), where("tokenNumber", "==", tokenNumber))
        : documentId
        ? query(collection(firestore, "sendData"), where("document_id", "==", documentId))
        : null;
  
      if (!queryConditions) {
        console.error("No valid tokenNumber or document_id provided.");
        return;
      }
  
      const tokenNumberQuerySnapshot = await getDocs(queryConditions);
      const querySnapshot = tokenNumberQuerySnapshot.docs;
  
      if (querySnapshot.length > 0) {
        const documentData = querySnapshot[0].data();
        console.log("Fetched Document Data:", documentData);
  
        // Map user emails and construct department information
        const loadedDepartments = documentData.addUserEmails.map((user, index) => {
          const versions =
            documentData.senderDocument && documentData.senderDocument[index]
              ? documentData.senderDocument[index].downloadUrl || []
              : [];
          return {
            name: user.name,
            versions: versions,
          };
        });
  
        // Set state with fetched details
        setDepartments(loadedDepartments);
        setDocumentName(documentData.fileName || "");
        setHierarchyName(documentData.department_hierarchy || "");
      } else {
        console.error("Document not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching document history:", error);
    }
  };
  
  const handleIframeLoad = () => {
    console.log("Iframe loaded");
  };
  const handleCompleteSigning = async () => {
    setSignedLoading(true);
    console.log(documentId, signerName);
    console.log(signerHasSigned);
    if (signerHasSigned == false) {
      toast.error("Please sign the document");
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/get_user_activity/`,
        {
          documentId,
          userName: signerName,
        }
      );
      if (response.data.user_activity.length > 0) {
        const reasons = response.data.user_activity[0].reasons;
        const hasSigned = reasons.some(
          (reason) => reason.reason === "document_signed"
        );
        setSignerHasSigned(hasSigned);
        const signedReason = reasons.find(
          (reason) => reason.reason === "document_signed"
        );
        if (signedReason) {
          const signedTime = signedReason.created_time;
          const signedDate = signedReason.created_date;
          const signedDateTime = `${signedDate} ${signedTime}`;
          try {
            const tokenNumberQuerySnapshot = await getDocs(
              query(
                collection(firestore, "sendData"),
                where("tokenNumber", "==", tokenNumber)
              )
            );
            const querySnapshot = tokenNumberQuerySnapshot.docs;
            if (querySnapshot.length > 0) {
              const documentData = querySnapshot[0].data();
              console.log(documentData);
              let { addUserEmails, document_id: docDataId } = documentData; // Extract `document_id` from `documentData`
              const signedTime = new Date().toISOString();
              const date = new Date(signedTime);
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
              addUserEmails = addUserEmails.map((user) => {
                if (
                  (docDataId === documentId) ||
                  (user.hasOwnProperty("document_id") &&
                    user.document_id === documentId) ||
                  user.email === signerEmail
                ) {
                  return {
                    ...user,
                    status: "Signed",
                    signedTime: hasSigned ? formattedDate : null,
                  };
                }
                return user;
              });
              const documentRef = doc(
                firestore,
                "sendData",
                querySnapshot[0].id
              );
              await updateDoc(documentRef, { addUserEmails });
              console.log(hasSigned);
              if (hasSigned) {
                navigate("/inboxed");
              } else {
                toast.error("Please sign the document");
              }
            } else {
              console.error("Document not found in Firestore");
            }
          } catch (error) {
            console.error("Error updating Firestore document:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
      setSignedLoading(false);
    } finally {
      setSignedLoading(false);
    }
  };
  useEffect(() => {
    if (signerHasSigned) {
      console.log("Signer has already signed the document.");
    } else {
      console.log("Signer has not yet signed the document.");
    }
  }, [signerHasSigned]);
  function getSuffix(number) {
    const suffixes = [
      "",
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
    ];
    return suffixes[number];
  }
  return (
    <div>
      <div style={{ position: "relative" }}>
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            zIndex: 10,
          }}
        ></div>
        <div>
          <iframe
            title="DocVault"
            ref={iframeRef}
            width="70%"
            height="880"
            allowFullScreen
            onLoad={handleIframeLoad}
          ></iframe>
          <>
            <button
              className="absolute left-1/2 transform -translate-x-1/2 px-4 mt-8 py-2 text-base font-semibold text-white rounded-full cursor-pointer"
              style={{ backgroundColor: "#6254B6" }}
              onClick={handleCompleteSigning}
              disabled={SignedLoading} // Disable button when loading
            >
              <span style={{ opacity: SignedLoading ? 0.5 : 1 }}>
                Click here to complete signing process
              </span>{" "}
              {SignedLoading && (
                <CircularProgress
                  size={20}
                  color="inherit"
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-40%, -50%)",
                  }}
                />
              )}
            </button>
          </>
          {/* <div className="fixed top-10 right- w-83 bg-white
          shadow-lg" style={{ height: "80vh", overflowY: "auto" }}> */}
          <div
            className="fixed top-10 right-1 md:right-1 lg:right-1 xl:right-1 w-83 max-w-83 bg-white shadow-lg"
            style={{ height: "80vh", overflowY: "auto" }}
          >
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-purple-800">
                Document History
              </h1>
            </div>
            <div className="p-4">
              <div className="mb-4">
                {/* <div className="grid grid-cols-2 gap-2 mb-2"> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <h3 className="font-semibold text-gray-700 ">
                    Hierarchy Name:
                  </h3>
                  <p className="text-left">{hierarchyName}</p>
                  <h3 className="font-semibold text-gray-700 ">
                    Document Name:
                  </h3>
                  <p className="text-left">{documentName}</p>
                </div>
              </div>
              <hr />
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 mt-4">
                  Department's List
                </h3>
                <ul className="space-y-2">
                  {departments.map((department, index) => (
                    <li key={index} className="flex flex-col ">
                      <div className="font-medium text-purple-600 mb-3">
                        {getSuffix(index + 1)} department:
                        <span className="pl-3">{department.name}</span>
                      </div>
                      {department.versions.length > 0 ? (
                        <ul className="space-y-1 mb-3">
                          {department.versions.map((url, vIndex) => (
                            <li key={vIndex} className="flex">
                              <div className="flex-3 mb-2">
                                <span>
                                  {documentName}{" "}
                                  <span
                                    onClick={() => window.open(url, "_blank")}
                                    style={{
                                      cursor: "pointer",
                                      color: "#007BFF",
                                      textDecoration: "underline",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.textDecoration = "none")
                                    }
                                    onMouseOut={(e) =>
                                      (e.target.style.textDecoration =
                                        "underline")
                                    }
                                  >
                                    {" "}
                                    (Version {vIndex + 1})
                                  </span>
                                </span>
                              </div>
                              {/* <div className="flex-1">
                              </div> */}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not any changes suggested.</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Iframe;
