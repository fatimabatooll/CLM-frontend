import React, { useState } from "react";
import { useLocation } from "react-router-dom";
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

function PdfView() {
  const location = useLocation();
  const pdfUrl = location.state?.pdfUrl;
  const documentId = location.state?.documentId
  const fileId = location.state?.fileId
  console.log(fileId)
  console.log(documentId)
  console.log(pdfUrl);
  const documentPath = pdfUrl ? `${pdfUrl}&documentId=${documentId}&fileId=${fileId}` : "";

  const handleDownloadClick = () => {
    const viewer = document.getElementById("pdfViewer").ej2_instances[0];
    viewer.serverActionSettings.download = "Download";
    
    viewer.download();
    
    viewer.serverActionSettings.download = "Download";
    console.log(viewer);
  };

 
  return (
    <>
      <div>
        {pdfUrl ? (
          <PdfViewerComponent
            id="pdfViewer"
            documentPath={pdfUrl} 
            // documentId={documentId}
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






      <button onClick={handleDownloadClick}>Download</button>
    </>
  );
}

export default PdfView;