import React, { useState, useEffect } from "react";
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

function PdfViewSender() {
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const pdfUrl = location.state?.pdfUrl;
  const tokenNumber = location.state?.tokenNumber;
  const currentUserEmail = location.state?.receiverEmail;
  const navigate = useNavigate();
  console.log(tokenNumber);
  const documentId = location.state?.documentId
  const email = location.state?.email;
  const fileId = location.state?.fileId


  const documentPath = pdfUrl ? `${pdfUrl}&documentId=${documentId}&fileId=${fileId}&senderEmail=${email}` : "";

  console.log(documentPath);

  const handleDownloadClick = () => {
    const viewer = document.getElementById("pdfViewer").ej2_instances[0];
    viewer.serverActionSettings.download = "DownloadMain";
    
    viewer.download();
    
    viewer.serverActionSettings.download = "DownloadMain";
    console.log(viewer);
  };

  const handleResend = async () => {
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
            let { addUserEmails, senderDocument } = documentData;

            // Check if addUserEmails and senderDocument exist and are arrays
            if (addUserEmails && Array.isArray(addUserEmails) && senderDocument && Array.isArray(senderDocument)) {
                console.log("CurrentUserEmail:", currentUserEmail); // Log currentUserEmail

                // Log all email addresses in addUserEmails array
                console.log("All Email Addresses:");
                addUserEmails.forEach((recipient) => console.log(recipient.email));

                // Find the recipient with status "Suggest Changes" for the current user's email
                const filteredUsers = addUserEmails.filter(
                    (recipient) => recipient.status === "Suggest Changes"
                );

                console.log("Recipient:", filteredUsers); // Log recipient

                if (filteredUsers.length > 0) {
                    // Update status to "Pending" for the recipient with "Suggest Changes" status
                    addUserEmails = addUserEmails.map((recipient) => {
                        if (recipient.status === "Suggest Changes" && recipient.email === currentUserEmail) {
                            return { ...recipient, status: "Pending" };
                        }
                        return recipient;
                    });

                    // Update status in senderDocument array
                    senderDocument = senderDocument.map((senderDoc) => {
                        if (senderDoc.status === "Suggest Changes" && senderDoc.senderemail === currentUserEmail) {
                            return { ...senderDoc, status: "Pending" };
                        }
                        return senderDoc;
                    });

                    // Update Firestore document with the modified addUserEmails and senderDocument arrays
                    const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
                    const viewer = document.getElementById("pdfViewer").ej2_instances[0];
                    viewer.serverActionSettings.download = "DownloadMain";
                    
                    viewer.download();
                    
                    viewer.serverActionSettings.download = "DownloadMain";
                    console.log(viewer);
                    await updateDoc(docRef, { addUserEmails, senderDocument });

                    navigate('/inboxed');
                    toast.success("Document status updated to Pending.");
                } else {
                    alert("No recipient with 'Suggest Changes' status found for the current user.");
                }
            } else {
                alert("addUserEmails or senderDocument is missing or not an array.");
            }
        } else {
            alert("Document not found.");
        }
    } catch (error) {
        console.error("Error resending file:", error);
        alert("Error resending file.");
    }
    setIsProcessing(false);
};



  

  return (
    <>
      <div>
        {pdfUrl ? (
          <PdfViewerComponent
            id="pdfviewer"
            documentPath={documentPath}
            serviceUrl="https://localhost:7255/PdfViewer"
            style={{ height: "900px" }}
          >
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

      <div style={{ justifyContent: "center", marginRight:'25%'}}>
  <button 
    className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
    style={{ backgroundColor: "#6254B6" }}
    onClick={handleResend}
  >
   {isProcessing ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : 'Resend'}
</button> 
 

</div>

    </>
  );
}

export default PdfViewSender;