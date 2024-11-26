import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import axios from "axios";

DocumentEditorContainerComponent.Inject(Toolbar);

function Docx() {
    const editorContainerRef = useRef(null);
    const location = useLocation();
    const otherUrl = location.state?.otherUrl;
    const documentId = location.state?.documentId;
    const fileId = location.state?.fileId;

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

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (!isAutoSaving) {
                saveEditedDocument(true); 
            }
        }, 5000); 

        return () => clearInterval(autoSaveInterval);
    }, [isAutoSaving]);

    const saveEditedDocument = async (isAutoSave = false) => {
        setIsAutoSaving(true);
        const editor = editorContainerRef.current?.documentEditor;
        if (!editor) {
            console.error("Editor is not initialized");
            setIsAutoSaving(false);
            return;
        }
        try {
            const blob = await editor.saveAsBlob('Docx');
            const storage = getStorage();
            const firestore = getFirestore();
            const timestamp = new Date().getTime();
            const fileName = `EditedDocument_${timestamp}.docx`;
            const fileRef = storageRef(storage, `documents/${fileName}`);

            const snapshot = await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);

            if (documentId) {
                const docRef = doc(firestore, "file", documentId);
                await updateDoc(docRef, {
                    downloadURL,
                    fileName,
                    timestamp: serverTimestamp(),
                });

                const formData = new FormData();
                formData.append("download_url", downloadURL);

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/file/update/${fileId}/`, 
                  formData,
                  {
                    withCredentials: true,
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                if (!isAutoSave) {
                    alert('Document edited and updated successfully!');
                }
                setLastSave(new Date()); 
            } else {
                console.error("Document ID is not provided");
            }
        } catch (error) {
            console.error("Error saving edited document:", error);
            if (!isAutoSave) {
                alert('Failed to save edited document!');
            }
        } finally {
            setIsAutoSaving(false);
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
            <button
                style={{ backgroundColor: '#6254B6', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}
                onClick={() => saveEditedDocument()}
            >
                Save Edited Document
            </button>
            {lastSave && (
                <div style={{ marginTop: '10px' }}>
                    Last saved at: {lastSave.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}

export default Docx;