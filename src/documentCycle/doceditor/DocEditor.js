import React, { useState, useRef, useEffect } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { PdfDocument, PdfBitmap, PdfPageOrientation, SizeF } from '@syncfusion/ej2-pdf-export';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, Timestamp } from "@firebase/firestore";
import { firestore } from '../../firestore/firestore';


DocumentEditorContainerComponent.Inject(Toolbar);
const DocumentEditorWithExport = () => {
  const documentEditorContainerRef = useRef(null);
  const [documentName, setDocumentName] = useState('Untitled');

  useEffect(() => {
    if (documentEditorContainerRef.current) {
      documentEditorContainerRef.current.serviceUrl = 'http://localhost:6002/api/documenteditor/';
    }
  }, []);

  const handleDocumentChange = () => {
    const container = documentEditorContainerRef.current;
    if (container) {
      setDocumentName(container.documentEditor.documentName || 'Untitled');
    }
  };

  const exportToPDF = async () => {
    if (!documentEditorContainerRef.current) {
        console.error("DocumentEditorContainer is not initialized yet.");
        return;
    }
    const documentEditor = documentEditorContainerRef.current.documentEditor;
    if (!documentEditor) {
        console.error("DocumentEditor is not accessible.");
        return;
    }
    const pdfDocument = new PdfDocument();
    const count = documentEditor.pageCount;
    const storage = getStorage();

    const uploadPdfToStorage = async (pdfBlob) => {
      try {
          const storage = getStorage();
          const storageRef = ref(storage, `pdfs/${documentName}.pdf`);
          
          // Provide metadata with contentType
          const metadata = {
              contentType: 'application/pdf'
          };
  
          // Upload PDF blob with metadata
          await uploadBytes(storageRef, pdfBlob, metadata);
          
          // Get download URL after successful upload
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
      } catch (error) {
          console.error("Error uploading PDF to Firebase Storage:", error);
          return null;
      }
  };
  
    const savePdfUrlToFirestore = async (pdfUrl) => {
        try {
            const fileData = {
                name: documentName,
                downloadURL: pdfUrl,
                createdAt: Timestamp.now()
            };
            await addDoc(collection(firestore, 'pdfs'), fileData);
        } catch (error) {
            console.error("Error saving PDF URL to Firestore:", error);
        }
    };

    for (let i = 1; i <= count; i++) {
        setTimeout(async () => {
            const format = 'image/jpeg';
            const image = documentEditor.exportAsImage(i, format);
            image.onload = async function () {
                const imageHeight = parseInt(image.style.height.replace('px', ''), 10);
                const imageWidth = parseInt(image.style.width.replace('px', ''), 10);
                const section = pdfDocument.sections.add();
                const settings = new SizeF(imageWidth, imageHeight);
                section.pageSettings.size = settings;
                section.pageSettings.orientation = imageWidth > imageHeight ? PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
                const page = section.pages.add();
                const graphics = page.graphics;
                const imageStr = image.src.replace('data:image/jpeg;base64,', '');
                const pdfImage = new PdfBitmap(imageStr);
                graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
                if (i === count) {
                  const pdfBlobPromise = pdfDocument.save();
                  const pdfBlob = await pdfBlobPromise;

                    console.log(pdfBlob);
                    const blobData = pdfBlob.blobData;
                    const blobSize = blobData.size;
                    const blobType = blobData.type;

                    // Now you can use this data as needed
                    console.log("Blob Data:", blobData);
                    console.log("Blob Size:", blobSize);
                    console.log("Blob Type:", blobType);
                    const pdfUrl = await uploadPdfToStorage(pdfBlob);
                    console.log(pdfUrl);
                    if (pdfUrl) {
                        savePdfUrlToFirestore(pdfUrl);
                        fetch(pdfUrl)
                        .then(response => response.blob())
                        .then(blob => {
                          // Get the file extension
                          const extension = blob.type.split('/')[1]; // 'pdf' in this case
                          
                          // Log the file extension
                          console.log('File extension:', extension);
                        })
                        .catch(error => {
                          console.error('Error fetching file:', error);
                        });
                    }
                    pdfDocument.destroy();
                }
            };
        }, 500 * i);
    }
};



 

  return (
    <div>
      <div id="title-bar">
      <h1>Document name</h1>
      <input
        type="text"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        onBlur={() => {
          const container = documentEditorContainerRef.current;
          if (container) {
            container.documentEditor.documentName = documentName;
          }
        }}
        class="w-30 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
        <button
        class="filelist-button text-white  ml-80 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-xs w-28 text-center mb-2 font-body"
        style={{ backgroundColor: '#6254B6' }}
        onClick={exportToPDF}>Export to PDF</button>
      </div>
      <DocumentEditorContainerComponent
        ref={documentEditorContainerRef}
        id="container"
        enableToolbar
        height={'900px'}
        documentChange={handleDocumentChange}
      />
    </div>
  );
};
export default DocumentEditorWithExport;