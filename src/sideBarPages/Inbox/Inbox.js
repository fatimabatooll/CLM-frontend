import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import Pagination from "../../components/pagination/Pagination";
import { Tooltip } from "@mui/material";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedMenus from "../../components/menuTab/MenuTabs";
import AuditTrail from "../../components/auditTrail/AuditTrail";
import "../../../src/sideBarPages/Inbox/Inbox.css";
import { BiSearchAlt } from "react-icons/bi";
import InboxSuggestChanges from "./InboxSuggestChanges";

const Inbox = () => {
  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [receivedDocs, setReceivedDocs] = useState([]);
  const [filterOption, setFilterOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this based on your preference
  const navigate = useNavigate();
  const [auditTrailModalOpen, setAuditTrailModalOpen] = useState(false);
  const [selectedAuditTrailData, setSelectedAuditTrailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceRerender, setForceRerender] = useState(false);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const filteredDocs = receivedDocs.filter((file) => {
    const fileNameMatch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const senderEmailMatch = file.senderemail
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterOption === "fileName") {
      return fileNameMatch && !file.recipient.documentSigned;
    } else if (filterOption === "senderEmail") {
      return senderEmailMatch && !file.recipient.documentSigned;
    } else if (filterOption === "NotSigned") {
      return !file.recipient.documentSigned;
    } else if (filterOption === "Signed") {
      return file.recipient.documentSigned;
    }

    return file;
  });

  // const handledocx = (file) => {
  //   if (file && file.fields && file.fields.download_url) {
  //     const url = file.fields.download_url.trim();
  //     console.log("URL: ", url);
  //     if (url.toLowerCase().includes(".pdf")) {
  //       console.log("Navigating to PDF view");
  //       navigate("/pdf-view", { state: { pdfUrl: url } });
  //     } else {
  //       console.log("Navigating to Word view");
  //       navigate("/word-view", { state: { otherUrl: url } });
  //     }
  //   } else {
  //     console.error("No valid download URL for the selected file.");
  //   }
  // };

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = filteredDocs.slice(indexOfFirstFile, indexOfLastFile);

  const handledocx = (file) => {
    if (file && file.fileUrl) {
      const documentId = file.firebase_documentId;
      const url = file.fileUrl;
      const email = file.recipient.email;
      const tokenNumber = file.tokenNumber;
      console.log(file);
      if (url.toLowerCase().includes(".pdf")) {
        console.log("Navigating to PDF view");
        navigate("/pdf-view-receiver", {
          state: { pdfUrl: url, tokenNumber: tokenNumber, documentId: documentId, email: email, fileId:file.fileId},
        });
      } else {
        console.log("Navigating to Word view");
        navigate("/docx-view-receiver", { state: { otherUrl: url,  tokenNumber: tokenNumber, documentId: documentId, email: email, fileId:file.fileId } });
      }
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };

  const handleSuggestdocx = async (file) => {
    if (file && file.fileUrl) {
      const url = file.fileUrl;
      const tokenNumber = file.tokenNumber;
      const receiverEmail = file.addUserEmails.map((user) => user.email);
      if (url.toLowerCase().includes(".pdf")) {
        try {
          navigate("/pdf-view-sender", {
            state: {
              pdfUrl: url,
              tokenNumber: tokenNumber,
              receiverEmail: receiverEmail,
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
  const handleAuditTrailClick = (data) => {
    console.log(data);
    if (data && data.recipient) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
      setForceRerender((prev) => !prev);
    } else if (data && data.recipient) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
      setForceRerender((prev) => !prev);
      console.error("Invalid data for Audit Trail");
    }
  };

  const openDocument = async (file) => {
    const documentId = file.recipient.document_id || file.document_id;
    console.log(documentId);
    const signerId = file.recipient.id;
    const signerName = file.recipient.name;
    const tokenNumber = file.tokenNumber;
    console.log(signerName);

    const signerEmail = file.recipient.email;

    const apiEndpoint = `${process.env.REACT_APP_API_URL}/file/embed_document/`;

    const postData = {
      documentId,
      signerId,
    };
    const headers = {
      Authorization: "Key yiruoot8n219dxz0butdqteq",
    };
    try {
      const response = await axios.post(apiEndpoint, postData, { headers });
      console.log(response);
      const embedDocument = response.data.data.embedDocument;

      console.log("API Response:", embedDocument);

      navigate(
        `/sign?documentId=${documentId}&signerName=${signerName}&signerEmail=${signerEmail}&tokenNumber=${tokenNumber}`,
        { state: embedDocument }
      ); // Pass documentId as a query parameter
      return embedDocument; // Return embedDocument, documentId, and signerName as an object
    } catch (error) {
      console.error("Error sending document for embedding:", error);
    }
  };

  // const handleSelectChange = (event) => {
  //   const value = event.target.value;
  //   setFilterOption(value);
  //   handleFilterOptionChange(value);
  // };

  const sortByRequestedTimeDescending = (a, b) => {
    if (a.requestedTime && b.requestedTime) {
      // If both requestedTime are defined, compare them
      const requestedTimeComparison =
        b.requestedTime.toDate() - a.requestedTime.toDate();
      if (requestedTimeComparison !== 0) {
        // If requestedTime values are not equal, return the comparison result
        return requestedTimeComparison;
      }
    } else if (a.requestedTime) {
      // If only b's requestedTime is undefined, a comes first
      return -1;
    } else if (b.requestedTime) {
      // If only a's requestedTime is undefined, b comes first
      return 1;
    }

    // If requestedTime values are equal or both undefined, compare suggestChangesTime
    if (a.suggestChangesTime && b.suggestChangesTime) {
      // If both suggestChangesTime are defined, compare them
      return b.suggestChangesTime - a.suggestChangesTime;
    } else if (a.suggestChangesTime) {
      // If only b's suggestChangesTime is undefined, a comes first
      return -1;
    } else if (b.suggestChangesTime) {
      // If only a's suggestChangesTime is undefined, b comes first
      return 1;
    }

    // If both suggestChangesTime values are equal or both undefined, return 0
    return 0;
  };

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (user.email) {
        const q = query(collection(firestore, "sendData"));
        try {
          const querySnapshot = await getDocs(q);
          const docsData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            firebase_documentId: doc.id, // Save Firebase document ID
          }));
  
          let matchingDocs = docsData.filter((doc) => {
            // Check if any addUserEmails entry matches the user's email
            const userEntry = doc.addUserEmails.find(
              (entry) => entry.email === user.email
            );
  
            // Filter based on status of the matching entry
            return userEntry && userEntry.status == "Pending";
          });
  
          // Map matchingDocs to include only the recipient entry
          matchingDocs = matchingDocs.map((doc) => {
            const recipient = doc.addUserEmails.find(
              (entry) => entry.email === user.email
            );
            return { ...doc, recipient };
          });
  
          matchingDocs = [...matchingDocs];
  
          console.log("fetchDocs: ", matchingDocs);
          setReceivedDocs(matchingDocs);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching received documents:", error);
          setLoading(false);
        }
      }
    };
    fetchReceivedDocs();
  }, [user.email]);
  

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div
        className="receive-doc w-full max-w-10xl px-12"
        style={{ height: "100vh" }}
      >
        <div className=" receive-doc-main">
          <h1
            className="text-2xl mb-4 mt-2"
            style={{ fontFamily: "poppins", color: "#6254B6 " }}
          >
            Unsigned Documents
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
                  {/* <option value="Signed">Signed</option>
                  <option value="NotSigned">Not Signed</option> */}
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
                      file={selectedFile} // Pass the selectedFile state as a prop
                      fileId={selectedFile ? selectedFile.pk : null}
                      onOpenDocument={handledocx}
                    />
                  </div>
                )}
              </div>
            )}
            <TableContainer
              style={{ borderRadius: "0.6rem" }}
              className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-2 sm:rounded-lg dark:focus:ring-sky-800 shadow-lg shadow-sky-8 00/50 dark:shadow-lg dark:shadow-sky-800/80 rounded-3xl"
              component={Paper}
            >
              <Table className=" main-table-inbox">
                <TableHead className="  w-full text-sm text-left rtl:text-right  dark:text-gray-400 mt-16">
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
                      Sender Name{" "}
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
                      Sender Email
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        width: "12%",
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
                        width: "6%",
                        color: "#6254B6",
                      }}
                      className="font-body "
                    >
                      Audit Trail
                    </TableCell>
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
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocs
                      .sort(sortByRequestedTimeDescending)
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((file, i) => (
                        <TableRow
                          key={i}
                          onClick={() => {
                            if (
                              file.recipient.document_id ||
                              file.document_id
                            ) {
                              openDocument(file);
                            } else {
                              handledocx(file);
                            }
                          }}
                          sx={{
                            backgroundColor:
                              selectedFile === file ? "lightblue" : "inherit",
                            // cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "lightgray",
                            },
                          }}
                        >
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "20%",
                            }}
                            className="font-body"
                          >
                            <Link className="black-link">{file.fileName}</Link>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "20%",
                            }}
                            className="font-body"
                          >
                            <Link className="black-link">{file.owner}</Link>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "20%",
                            }}
                            className="font-body"
                          >
                            <Link className="black-link">
                              {file.senderemail}
                            </Link>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "20%",
                            }}
                            className="font-body"
                          >
                            {file.requestedTime ? (
                              <>
                                {file.requestedTime
                                  .toDate()
                                  .toLocaleDateString(undefined, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                ,{" "}
                                {file.requestedTime
                                  .toDate()
                                  .toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })}
                              </>
                            ) : file.suggestChangesTime ? (
                              <>{file.suggestChangesTime}</>
                            ) : (
                              "pending"
                            )}
                          </TableCell>

                          {/* <TableCell
                        style={{
                          fontSize: "16px",
                          marginLeft: "20%",
                          width: "20%",
                        }}
                        className="font-body"
                      >

                      </TableCell> */}
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "10%",
                              padding: "20px",
                            }}
                            className="font-body"
                          >
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
                  key={forceRerender}
                  open={auditTrailModalOpen}
                  onClose={() => setAuditTrailModalOpen(false)}
                  data={selectedAuditTrailData}
                />
              </Table>
            </TableContainer>
          </div>
        </div>
        <InboxSuggestChanges></InboxSuggestChanges>
      </div>
    </>
  );
};

export default Inbox;
