import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";
import { firestore } from "../../../firestore/firestore";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";

function PdfViewReceiver() {
  const location = useLocation();
  const pdfUrl = location.state?.pdfUrl;
  const tokenNumber = location.state?.tokenNumber;
  const email = location.state?.email;

  console.log(tokenNumber);
  const [status, setStatus] = useState("Pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const documentId = location.state?.documentId;
  const fileId = location.state?.fileId;
  const documentPath = pdfUrl
    ? `${pdfUrl}&documentId=${documentId}&fileId=${fileId}&senderEmail=${email}`
    : "";

  const handleDownloadClick = () => {
    const viewer = document.getElementById("pdfViewer").ej2_instances[0];
    viewer.serverActionSettings.download = "Download";

    viewer.download();

    viewer.serverActionSettings.download = "Download";
    console.log(viewer);
  };

  const handleApprove = async () => {
    try {
      // Fetch document data from Firestore
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "sendData"),
          where("tokenNumber", "==", tokenNumber)
        )
      );
      if (!querySnapshot.empty) {
        const documentData = querySnapshot.docs[0].data();
        const { addUserEmails } = documentData;

        // Find the index of the pending recipient
        const pendingRecipientIndex = addUserEmails.findIndex(
          (recipient) => recipient.status === "Pending"
        );
        const approvedTime = new Date().toISOString();
        const date = new Date(approvedTime);
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
        if (pendingRecipientIndex !== -1) {
          // Update status to Approved for the pending recipient
          const updatedAddUserEmails = [...addUserEmails];

          updatedAddUserEmails[pendingRecipientIndex].status = "Approved";
          updatedAddUserEmails[pendingRecipientIndex].approveTime =
            formattedDate;

          // Find the index of the next recipient
          const nextRecipientIndex = pendingRecipientIndex + 1;

          // If next recipient exists and it's not the last one, update status to Pending
          if (nextRecipientIndex < addUserEmails.length - 1) {
            updatedAddUserEmails[nextRecipientIndex].status = "Pending";
            updatedAddUserEmails[nextRecipientIndex].sentTime =
              new Date().toISOString();
          } else {
            // If it's the last recipient, set status to Prepare for signing
            updatedAddUserEmails[nextRecipientIndex].status =
              "Prepare for signing";
          }

          // Update Firestore document with the modified addUserEmails array
          const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
          await updateDoc(docRef, { addUserEmails: updatedAddUserEmails });

          // Show success message
          toast.success("File approved and status updated.");
          navigate("/inboxed");

          // Update local status state
          setStatus("Approved");

          // Log the last recipient if it's the last one
          if (nextRecipientIndex === addUserEmails.length - 1) {
            console.log(
              "Last Recipient:",
              updatedAddUserEmails[nextRecipientIndex]
            );
          }
        } else {
          // No pending recipient found
          alert("No pending recipient found.");
        }
      } else {
        // Document not found
        alert("Document not found.");
      }
    } catch (error) {
      // Handle error
      console.error("Error approving file:", error);
      alert("Error approving file.");
    }
  };

  const handleSuggestChanges = async () => {
    setIsProcessing(true);
    try {
      // Fetch document data from Firestore
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "sendData"),
          where("tokenNumber", "==", tokenNumber)
        )
      );
      if (!querySnapshot.empty) {
        const documentData = querySnapshot.docs[0].data();
        const { addUserEmails } = documentData;

        // Find the index of the pending recipient
        const pendingRecipientIndex = addUserEmails.findIndex(
          (recipient) => recipient.status === "Pending"
        );
        console.log(pendingRecipientIndex);
        if (pendingRecipientIndex !== -1) {
          // Update status to Suggest Changes for the pending recipient
          const updatedAddUserEmails = [...addUserEmails];
          const suggestChangesTime = new Date().toISOString();
          const date = new Date(suggestChangesTime);
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
          updatedAddUserEmails[pendingRecipientIndex].status =
            "Suggest Changes";
          updatedAddUserEmails[pendingRecipientIndex].suggestChangesTime =
            formattedDate;

          // Check if senderDocument array exists
          let senderDocument = documentData.senderDocument || [];

          // Find the sender's document in the senderDocument array
          const senderDocumentIndex = senderDocument.findIndex(
            (doc) =>
              doc.senderemail ===
              documentData.addUserEmails[pendingRecipientIndex].email
          );

          if (senderDocumentIndex !== -1) {
            // Sender's document already exists, update the status and time
            senderDocument[senderDocumentIndex].status = "Suggest Changes";
            senderDocument[senderDocumentIndex].suggestChangesTime =
              formattedDate;
          } else {
            // Create a new sender's document and add it to the senderDocument array
            senderDocument.push({
              email: documentData.senderemail,
              owner: documentData.addUserEmails[pendingRecipientIndex].name,
              senderemail:
                documentData.addUserEmails[pendingRecipientIndex].email,
              fileName: documentData.fileName,
              status: "Suggest Changes",
              suggestChangesTime: formattedDate,
            });
          }

          // Update Firestore document with the modified addUserEmails array and the senderDocument array
          const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            addUserEmails: updatedAddUserEmails,
            senderDocument: senderDocument,
          });

          // Show success message
          // toast.success("Suggested changes successfully.");
          // navigate("/inboxed");
          toast.success("Suggested changes successfully.", {
            onClose: () => {
              navigate("/inboxed"); // Navigate after the toast is dismissed
              console.log("Suggest Changes button clicked!!!!!!");
            },
            autoClose: 4000,
          });

          // Update local status state
          setStatus("Suggest Changes");

          // Call viewer download settings function
          const viewer = document.getElementById("pdfViewer").ej2_instances[0];
          viewer.serverActionSettings.download = "Download";
          viewer.download();
          viewer.serverActionSettings.download = "Download";
          console.log(viewer);
        } else {
          // No pending recipient found
          alert("No pending recipient found.");
        }
      } else {
        // Document not found
        alert("Document not found.");
      }
    } catch (error) {
      // Handle error
      console.error("Error suggesting changes:", error);
      alert("Error suggesting changes.");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div>
        {pdfUrl ? (
          <PdfViewerComponent
            id="pdfViewer"
            documentPath={documentPath}
            serviceUrl="https://localhost:7255/PdfViewer"
            style={{ height: "900px" }}>
            <Inject
              services={[
                Toolbar,
                Magnification,
                Navigation,
                LinkAnnotation,
                BookmarkView,
                ThumbnailView,
                Print,
                TextSelection,
                TextSearch,
                Annotation,
                FormFields,
                FormDesigner,
              ]}
            />
          </PdfViewerComponent>
        ) : (
          <p>No PDF URL provided.</p>
        )}
      </div>
      <div style={{ justifyContent: "center", marginRight: "25%" }}>
        <button
          className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
          style={{ backgroundColor: "#6254B6", marginRight: "10px" }}
          onClick={handleApprove}>
          Approve
        </button>
        {/* <button
          className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
          style={{ backgroundColor: "#6254B6" }}
          onClick={handleSuggestChanges}
        >
          Suggest Changes
        </button> */}

        <button
          className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
          style={{ backgroundColor: "#6254B6" }}
          onClick={handleSuggestChanges}
          disabled={isProcessing}>
          {isProcessing ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <div
                className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"
                role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            "Suggest Changes"
          )}
        </button>
      </div>
    </>
  );
}

export default PdfViewReceiver;