import React, { useEffect, useRef, useState } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
import { firestore } from "../../../firestore/firestore";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

DocumentEditorContainerComponent.Inject(Toolbar);

function DocxViewReceiver() {
    const editorContainerRef = useRef(null);
    const location = useLocation();
    const otherUrl = location.state?.otherUrl;
    const tokenNumber = location.state?.tokenNumber;
    const navigate = useNavigate();
    const documentId = location.state?.documentId
    console.log(documentId)
    const fileId = location.state?.fileId
    console.log(fileId)

    const email = location.state?.email;
    console.log(email)

    const [status, setStatus] = useState("Pending");
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

    const handleApprove = async () => {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(firestore, "sendData"),
                    where("tokenNumber", "==", tokenNumber)
                )
            );
            if (!querySnapshot.empty) {
                const documentData = querySnapshot.docs[0].data();
                const { addUserEmails } = documentData;

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
                    const updatedAddUserEmails = [...addUserEmails];

                    updatedAddUserEmails[pendingRecipientIndex].status = "Approved";
                    updatedAddUserEmails[pendingRecipientIndex].approveTime = formattedDate;

                    const nextRecipientIndex = pendingRecipientIndex + 1;

                    if (nextRecipientIndex < addUserEmails.length - 1) {
                        updatedAddUserEmails[nextRecipientIndex].status = "Pending";
                        updatedAddUserEmails[nextRecipientIndex].sentTime = new Date().toISOString();
                    } else {
                        updatedAddUserEmails[nextRecipientIndex].status = "Prepare for signing";
                    }

                    const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
                    await updateDoc(docRef, { addUserEmails: updatedAddUserEmails });

                    toast.success("File approved and status updated.");
                    navigate('/inboxed');

                    setStatus("Approved");

                    if (nextRecipientIndex === addUserEmails.length - 1) {
                        console.log("Last Recipient:", updatedAddUserEmails[nextRecipientIndex]);
                    }
                } else {
                    alert("No pending recipient found.");
                }
            } else {
                alert("Document not found.");
            }
        } catch (error) {
            console.error("Error approving file:", error);
            alert("Error approving file.");
        }
    };

    const handleSuggestChanges = async () => {
        const editor = editorContainerRef.current?.documentEditor;
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(firestore, "sendData"),
                    where("tokenNumber", "==", tokenNumber)
                )
            );
            if (!querySnapshot.empty) {
                const documentData = querySnapshot.docs[0].data();
                const { addUserEmails } = documentData;
                const pendingRecipientIndex = addUserEmails.findIndex(
                    (recipient) => recipient.status === "Pending"
                );
                if (pendingRecipientIndex !== -1) {
                    const updatedAddUserEmails = [...addUserEmails];
                    updatedAddUserEmails[pendingRecipientIndex].status = "Suggest Changes";
                    updatedAddUserEmails[pendingRecipientIndex].suggestChangesTime = new Date().toISOString();
                    let senderDocument = documentData.senderDocument || [];
                    const senderEmail = addUserEmails[pendingRecipientIndex].email;
                    const senderDocumentIndex = senderDocument.findIndex(
                        (doc) => doc.senderemail === senderEmail
                    );
                    const uniqueTimestamp = new Date().toISOString().replace(/[:.-]/g, '');
                    const uniqueFileName = `${documentData.fileName.split('.')[0]}_${uniqueTimestamp}.docx`;
                    const storage = getStorage();
                    const uploadRef = ref(storage, `documents/${uniqueFileName}`);
                    const editedBlob = await editor.saveAsBlob('Docx');
                    await uploadBytes(uploadRef, editedBlob);
                    const downloadUrl = await getDownloadURL(uploadRef);
                    if (senderDocumentIndex !== -1) {
                        senderDocument[senderDocumentIndex].status = "Suggest Changes";
                        senderDocument[senderDocumentIndex].suggestChangesTime = updatedAddUserEmails[pendingRecipientIndex].suggestChangesTime;
                        if (!Array.isArray(senderDocument[senderDocumentIndex].downloadUrl)) {
                            senderDocument[senderDocumentIndex].downloadUrl = senderDocument[senderDocumentIndex].downloadUrl ? [senderDocument[senderDocumentIndex].downloadUrl] : [];
                        }
                        if (!senderDocument[senderDocumentIndex].downloadUrl.includes(downloadUrl)) {
                            senderDocument[senderDocumentIndex].downloadUrl.push(downloadUrl);
                        }
                    } else {
                        senderDocument.push({
                            email: documentData.senderemail,
                            owner: addUserEmails[pendingRecipientIndex].name,
                            senderemail: senderEmail,
                            fileName: uniqueFileName,
                            status: "Suggest Changes",
                            suggestChangesTime: updatedAddUserEmails[pendingRecipientIndex].suggestChangesTime,
                            downloadUrl: [downloadUrl]
                        });
                    }
                    const docRef = doc(firestore, "sendData", querySnapshot.docs[0].id);
                    await updateDoc(docRef, {
                        addUserEmails: updatedAddUserEmails,
                        senderDocument: senderDocument,
                    });
                    toast.success("Suggested changes successfully.");
                    setStatus("Suggest Changes");
                } else {
                    alert("No pending recipient found.");
                }
            } else {
                alert("Document not found.");
            }
        } catch (error) {
            console.error("Error suggesting changes:", error);
            alert("Error suggesting changes.");
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
                    style={{ backgroundColor: "#6254B6", marginRight: "10px" }}
                    onClick={handleApprove}
                >
                    Approve
                </button>
                <button
                    className="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-36 text-center mb-2 font-body"
                    style={{ backgroundColor: "#6254B6" }}
                    onClick={handleSuggestChanges}
                >
                    Suggest Changes
                </button>
            </div>
        </div>
    );
}

export default DocxViewReceiver;
