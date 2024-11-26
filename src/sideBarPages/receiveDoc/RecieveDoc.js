import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../firestore/firestore";
import axios from "axios";
import {
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import Pagination from "../../components/pagination/Pagination";
import CustomizedMenus from "../../components/menuTab/MenuTabs";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CircularProgress from "@mui/material/CircularProgress";
import AuditTrail from "../../components/auditTrail/AuditTrail";
import { Toaster, toast } from "sonner";
import "../../../src/sideBarPages/receiveDoc/ReceiveDoc.css";
import { BiSearchAlt } from "react-icons/bi";
import { onSnapshot } from "firebase/firestore";

const ReceiveDoc = () => {
  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [receivedDocs, setReceivedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState(null);
  const [auditTrailModalOpen, setAuditTrailModalOpen] = useState(false);
  const [selectedAuditTrailData, setSelectedAuditTrailData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState("");
  const [signingLoading, setSigningLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const handledocx = async (file) => {
    console.log(file.download_url);
    if ((file && file.fileUrl) || (file && file.download_url)) {
      const url = file.fileUrl || file.download_url;
      const tokenNumber = file.tokenNumber;
      if (url.toLowerCase().includes(".pdf")) {
        try {
          navigate("/pdf-view", {
            state: {
              pdfUrl: url,
            },
          });
          console.log("Navigating to PDF view");
        } catch (error) {
          console.error("Error navigating to PDF view:", error);
          // Handle navigation error gracefully (e.g., display an error message)
        }
      } else {
        console.log("Not a PDF file. Navigating to Word view (if applicable)");
        navigate("/word-view", { state: { otherUrl: url } }); // Assuming a Word view route exists
      }
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };

  useEffect(() => {
    if (!user || !user.email) return;

    setLoading(true);
    console.log("senderEmail", user.email);
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "sendData"),
        where("senderemail", "==", user.email)
      ),

      (querySnapshot) => {
        const docsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { addUserEmails, ...rest } = data;
          addUserEmails.forEach((recipient) => {
            docsData.push({ ...rest, recipient });
          });
          console.log("addUsersEmail", addUserEmails);
        });
        setReceivedDocs(docsData);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (!user || !user.email) {
        console.error("User or user email is undefined.");
        return;
      }

      setLoading(true);

      const q = query(
        collection(firestore, "sendData"),
        where("senderemail", "==", user.email)
      );

      try {
        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data);
          if (data.addUserEmails && data.addUserEmails.length > 0) {
            const recipient = data.addUserEmails[0];
            return { ...data, recipient, tokenNumber: data.tokenNumber };
          } else {
            console.error("Recipient data not found for document:", data);
            return null;
          }
        });
        const docsWithData = docsData.filter((doc) => doc.tokenNumber);
        console.log(docsWithData);
        const docsWithoutData = docsData.filter((doc) => !doc.tokenNumber);
        console.log(docsWithoutData);

        // Separate documents with and without a token number
        const groupedDocs = groupBy(docsWithData, "tokenNumber");
        const newArray = [];
        docsWithoutData.forEach((doc) => {
          const { addUserEmails, ...rest } = doc;
          addUserEmails.forEach((recipient) => {
            newArray.push({ ...rest, recipient }); // Pushing each recipient separately
            console.log(newArray);
          });
        });

        // Flatten the grouped documents and add them to the receivedDocs state
        const groupArray = Object.entries(groupedDocs).flatMap(
          ([groupKey, files]) => files.map((file) => ({ ...file, groupKey }))
        );
        setReceivedDocs([...groupArray, ...newArray]);
      } catch (error) {
        console.error("Error fetching received documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedDocs();
  }, [user.email]);

  const handleSend = async (file) => {
    setSigningLoading(true);
    console.log(file);
    try {
      // Fetch document data from Firestore
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "sendData"),
          where("tokenNumber", "==", file.tokenNumber)
        )
      );

      if (!querySnapshot.empty) {
        const documentData = querySnapshot.docs[0].data();
        const { addUserEmails } = documentData;

        // Find the recipient with status "Prepare for signing"
        const recipientWithPrepareForSigning = addUserEmails.find(
          (recipient) => recipient.status === "Prepare for signing"
        );

        if (!recipientWithPrepareForSigning) {
          console.log("Recipient with 'Prepare for signing' status not found.");
          return;
        }
        const response = await fetch(file.fileUrl);
        console.log(response);
        const blob = await response.blob();

        console.log("blob:", blob);

        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

        console.log("arrayBuffer:", arrayBuffer);
        const blobData = new Blob([arrayBuffer], { type: "application/pdf" });
        console.log("blobData:", blobData);
        // Create FormData and append the binary data
        const formData = new FormData();
        formData.append("file", blobData, "file.pdf");

        // Perform other operations like uploading file and navigating
        console.log(formData);
        const createDocumentResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/file/create_document/`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(
          "here is the createDocumentResponse:",
          createDocumentResponse.data
        );
        if (
          createDocumentResponse.data.data &&
          createDocumentResponse.data.data.createDocument.id
        ) {
          const documentId = createDocumentResponse.data.data.createDocument.id;

          // Update postData with file and document information
          const postData = {
            recipientIds: [recipientWithPrepareForSigning.id], // Use only the recipient with "Prepare for signing" status
            recipients: [recipientWithPrepareForSigning], // Use only the recipient with "Prepare for signing" status
            file: {
              fileName: file.name,
              downloadURL: file.downloadURL,
              timestamp: file.timestamp,
              documentId: documentId,
              account: user.id,
            },
          };
          setPostData(postData);
          localStorage.setItem("document_id", documentId);

          const url = file.fileUrl.split("googleapis.com")[1];
          const encodedURL = encodeURIComponent(url);
          const stateData = {
            postData: postData,
            doc: encodedURL,
            file: file,
            tokenNumber: file.tokenNumber,
          };
          navigate("/document", { state: stateData });
          await updateDoc(
            doc(firestore, "sendData", querySnapshot.docs[0].id),
            {
              addUserEmails: addUserEmails.map((recipient) => {
                if (recipient.id === recipientWithPrepareForSigning.id) {
                  return {
                    ...recipient,
                    document_id: documentId,
                  };
                }

                return recipient;
              }),
            }
          );
        }
      } else {
        console.log("Document not found for the given tokenNumber.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSigningLoading(false);
    }
  };

  function groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
      const groupKey = obj[key];
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(obj);
      return acc;
    }, {});
  }

  const filteredDocs = receivedDocs.filter((file) => {
    const fileNameMatch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const recipient = file.recipient;
    if (!recipient) return false; // Check if recipient is undefined

    const statusMatch =
      recipient.status === "Approved" ? "Approved" : "Pending";

    if (!filterOption) {
      return (
        fileNameMatch ||
        recipient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statusMatch.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (filterOption === "fileName") {
      return fileNameMatch;
    } else if (filterOption === "senderEmail") {
      return recipient.email.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterOption === "Approved") {
      return statusMatch.toLowerCase() === "approved";
    } else if (filterOption === "Pending") {
      return statusMatch.toLowerCase() === "pending";
    }

    return true;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  const sortByRequestedTimeAscending = (a, b) => {
    return b.requestedTime.toDate() - a.requestedTime.toDate();
  };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const openDocument = async (file) => {
    const documentId =
      file.document_id ||
      file.addUserEmails.find((email) => email.document_id)?.document_id;

    console.log(documentId);
    try {
      const response = await axios.post(
        "https://api.emiratessign.ae/graphql",
        {
          query: `
            query GetDocument($documentId: ID!) {
              getDocument(documentId: $documentId) {
                id,
                status,
                sourceUrl,
                signedUrl,
                signed
              }
            }`,
          variables: { documentId },
        },
        {
          headers: {
            Authorization: "Key yiruoot8n219dxz0butdqteq",
            "Content-Type": "application/json",
          },
        }
      );

      const documentStatus = response.data.data.getDocument.status;
      console.log(documentStatus);
      if (documentStatus === "signed") {
        const downloadUrl = response.data.data.getDocument.signedUrl;
        window.open(downloadUrl);
        console.log(downloadUrl);
      } else {
        toast.error("Document is not signed. Cannot download.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAuditTrailClick = (data) => {
    console.log(data);
    if (data && data.tokenNumber) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
    } else if (data && data.recipient) {
      
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);

      console.error("Invalid data for Audit Trail");
    }
  };

  return (
    <>
      {signingLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 w-full h-full flex justify-center items-center bg-gray-200 bg-opacity-75">
          <CircularProgress size={40} color="primary" />
        </div>
      )}
      <div className="receive-doc w-full  px-8  " style={{ height: "100vh" }}>
        <div className=" receive-doc-main">
          <h1
            className="text-2xl mb-4 mt-2"
            style={{ fontFamily: "poppins", color: "#6254B6 " }}
          >
            Sent Documents
          </h1>
          <div className=" grid grid-cols-2">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search files by name or tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <BiSearchAlt className="search-icon" /> */}
            </div>

            <div className="flex items-center justify-between mt-2 mr-2 mb-4">
              <div style={{ width: "50%", marginLeft: "50%" }}>
                <select
                  className="filters"
                  id="filter-option-select"
                  value={filterOption || ""}
                  onChange={handleFilterOptionChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    color: "#888",
                  }}
                >
                  <option value="">None</option>

                  <option value="fileName">File Name</option>
                  <option value="senderEmail">Sender Email</option>
                  <option value="Signed">Signed</option>
                  <option value="NotSigned">Not Signed</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" max-w-10xl">
            {selectedFile && (
              <div style={{ marginTop: "1%" }}>
                {selectedFile && (
                  <div style={{ marginBottom: "-1%" }}>
                    <CustomizedMenus
                      file={selectedFile}
                      fileId={selectedFile ? selectedFile.pk : null}
                      onOpenDocument={handledocx}
                    />
                  </div>
                )}
              </div>
            )}
            <TableContainer
              style={{ borderRadius: "15px" }}
              className=" w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-2 sm:rounded-lg dark:focus:ring-sky-800 shadow-lg shadow-sky-8 00/50 dark:shadow-lg dark:shadow-sky-800/80 rounded-3xl"
              component={Paper}
            >
              <Table className=" main-table">
                <TableHead className="  w-auto text-sm text-left rtl:text-right  dark:text-gray-400 mt-16">
                  <TableRow
                    style={{
                      backgroundColor: "#E4E1FA",
                      color: "#6254B6 ",
                      borderColor: "#6254B6",
                    }}
                    className=""
                  >
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      File Name
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body"
                    >
                      Owner
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      Sender
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      Requested Time{" "}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body"
                    >
                      Receiver
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      Audit Trail
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "10%",
                      }}
                      className="font-body text-white"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={30} />
                      </TableCell>
                    </TableRow>
                  ) : filteredDocs.length === 0 ? (
                    // : receivedDocs.length == 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocs
                      .sort(sortByRequestedTimeAscending)
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((file, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            backgroundColor:
                              selectedFile === file ? "lightblue" : "inherit",
                            // cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "lightgray",
                            },
                          }}
                        >
                          {/* <TableCell>{file.fileName}</TableCell> */}
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "20%",
                            }}
                            className="font-body"
                          >
                            <span
                              onClick={() => handledocx(file)}
                              style={{ cursor: "pointer", color: "#6254B6 " }}
                            >
                              {file.fileName}
                            </span>
                          </TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "-20%",
                              width: "15%",
                            }}
                            className="font-body"
                          >
                            <Link className="black-link">{file.owner}</Link>
                          </TableCell>
                          <TableCell>{file.senderemail}</TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "15%",
                            }}
                            className="font-body"
                          >
                            {file.addUserEmails &&
                            file.addUserEmails.some(
                              ({ status }) => status === "Prepare for signing"
                            ) ? (
                              <button
                                onClick={() => handleSend(file)}
                                disabled={signingLoading} // Disable the button when loading
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: signingLoading
                                    ? "default"
                                    : "pointer", // Change cursor based on loading state
                                  color: "#6254B6",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                Prepare for signing
                              </button>
                            ) : file.recipient.status == "Signed" ||
                              (file.addUserEmails &&
                                file.addUserEmails.some(
                                  ({ status }) => status === "Signed"
                                )) ? (
                              <span>Signed</span>
                            ) : (
                              "Pending..."
                            )}
                          </TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "15%",
                            }}
                            className="font-body"
                          >
                            {file.requestedTime
                              ? file.requestedTime
                                  .toDate()
                                  .toLocaleDateString(undefined, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                  })
                              : ""}
                          </TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              width: "15%",
                            }}
                            className="font-body"
                          >
                            {file.department_hierarchy ? (
                              <>{file.department_hierarchy} Hierarchy</>
                            ) : (
                              <>{file.recipient.email}</>
                            )}
                          </TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "10%",
                              padding: "20px",
                            }}
                            className="font-body"
                          >
                            {/* Render the audit trail button only for the first file in each group */}

                            <Tooltip title="audit-trail" arrow>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAuditTrailClick(file);
                                }}
                                className="inline-flex items-center justify-center h-6 w-6 p-1 ms-8 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                              >
                                <ContentPasteSearchIcon />
                              </button>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "10%",
                              padding: "20px",
                            }}
                            className="font-body"
                          >
                            {file.recipient.status === "Signed" ||
                            (file.addUserEmails &&
                              file.addUserEmails.some(
                                ({ status }) => status === "Signed"
                              )) ? (
                              <Tooltip title="Download" arrow>
                                <span
                                  style={{
                                    color: "#6254B6",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDocument(file);
                                  }}
                                  className="inline-flex items-center justify-center mr-6 h-8 w-8 p-1 ms-8 text-sm font-medium text-cyan-500 cursor-pointer focus:outline-none dark:text-gray-400"
                                >
                                  Download
                                </span>
                              </Tooltip>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>

                <tfoot>
                  {filteredDocs.length > 5 && (
                    <tr className="">
                      <td className=" py-[11px] text-sm text-gray-400 pl-3">
                        Showing {currentPage} to {totalPages} of{" "}
                        {filteredDocs.length}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>


                      <td className=" pt-[13px] pb-[11px] pr-4">
                        <div className="flex justify-end items-center mr-2">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tfoot>
                <AuditTrail
                  open={auditTrailModalOpen}
                  onClose={() => setAuditTrailModalOpen(false)}
                  data={selectedAuditTrailData}
                />
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiveDoc;
