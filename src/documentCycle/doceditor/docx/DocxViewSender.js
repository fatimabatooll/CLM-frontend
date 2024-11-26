import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {  getFirestore, serverTimestamp } from "firebase/firestore";
import axios from "axios";
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

DocumentEditorContainerComponent.Inject(Toolbar);

function DocxViewSender() {
    const editorContainerRef = useRef(null);
    const location = useLocation();
    const otherUrl = location.state?.otherUrl;
    console.log("url",otherUrl)
    const documentId = location.state?.documentId;
    const fileId = location.state?.fileId;
    const tokenNumber = location.state?.tokenNumber;
    const currentUserEmail = location.state?.receiverEmail;
    const navigate = useNavigate();
    console.log(tokenNumber);

    const [sfdtContent, setSfdtContent] = useState(null);
    const [lastSave, setLastSave] = useState(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    useEffect(() => {
        const fetchSfdtContent = async () => {
            if (!otherUrl) return;
            try {
                const formData = new FormData();
                formData.append('fileLink', otherUrl);
                const response = await fetch('http://127.0.0.1:8080/api/wordeditor/Import', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    setSfdtContent(data);
                } else {
                    console.error('Failed to fetch SFDT content:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        };
        fetchSfdtContent();
    }, [otherUrl]);

    useEffect(() => {
        if (editorContainerRef.current && sfdtContent) {
            editorContainerRef.current.documentEditor.open(JSON.stringify(sfdtContent));
        }
    }, [sfdtContent]);

    

   
    const handleResend = async () => {
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
    
                // Existing logic for checking and updating status
                const filteredUsers = addUserEmails.filter(
                    (recipient) => recipient.status === "Suggest Changes" && recipient.email === currentUserEmail
                );
    
                if (filteredUsers.length > 0) {
                    // Update status to "Pending"
                    addUserEmails = addUserEmails.map((recipient) => {
                        if (recipient.status === "Suggest Changes" && recipient.email === currentUserEmail) {
                            return { ...recipient, status: "Pending" };
                        }
                        return recipient;
                    });
    
                    senderDocument = senderDocument.map((senderDoc) => {
                        if (senderDoc.status === "Suggest Changes" && senderDoc.senderemail === currentUserEmail) {
                            return { ...senderDoc, status: "Pending" };
                        }
                        return senderDoc;
                    });
    
                    // Update Firestore document
                    const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
                    await updateDoc(docRef, { addUserEmails, senderDocument });
    
                    // New logic to save as DOCX
                    const editor = editorContainerRef.current?.documentEditor;
                    if (editor) {
                        const blob = await editor.saveAsBlob('Docx');
                        const storage = getStorage();
                        const storageReference = storageRef(storage, `documents/${documentId}.docx`);
                        const uploadResult = await uploadBytes(storageReference, blob);
                        const downloadUrl = await getDownloadURL(uploadResult.ref);
                        await updateDoc(docRef, { fileUrl: downloadUrl });
                    }
    
                    navigate('/inboxed');
                    toast.success("Document status and file updated.");
                } else {
                    alert("No recipient with 'Suggest Changes' status found for the current user.");
                }
            } else {
                alert("Document not found.");
            }
        } catch (error) {
            console.error("Error resending file:", error);
            alert("Error resending file.");
        }
    };
    
    
    
    
    
    return (
        <div>
            <DocumentEditorContainerComponent 
                ref={editorContainerRef}
                id="container" 
                height={'590px'} 
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
            />
            <div style={{ justifyContent: "center", marginRight:'25%'}}>
            <button 
              className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
              style={{ backgroundColor: "#6254B6" }}
              onClick={handleResend}
            >
              Resend
            </button>
          
          </div>
        </div>
    );
}

export default DocxViewSender;