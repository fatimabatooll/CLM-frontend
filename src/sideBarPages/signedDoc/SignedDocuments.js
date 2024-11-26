import React, { useState, useEffect } from "react";
import { collection, documentId, getDocs, query } from "firebase/firestore";
// import { firestore } from "../../../firestore/firestore";
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
import CustomizedMenus from "../../components/menuTab/MenuTabs";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CircularProgress from "@mui/material/CircularProgress";
import AuditTrail from "../../components/auditTrail/AuditTrail";
import "../../../src/sideBarPages/signedDoc/Signeddoc.css";
import { BiSearchAlt } from "react-icons/bi";

const SignedDocuments = () => {
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

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  // const handleSelectChange = (event) => {
  //   const value = event.target.value;
  //   setFilterOption(value);
  //   handleFilterOptionChange(value);
  // };

  const filteredDocs = receivedDocs.filter((file) => {
    const fileNameMatch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const senderEmailMatch = file.senderemail
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterOption === "fileName") {
      return fileNameMatch && file.recipient.status;
    } else if (filterOption === "senderEmail") {
      return senderEmailMatch && file.recipient.status;
    }

    return file;
  });

  const sortByRequestedTimeDescending = (a, b) => {
    return b.requestedTime.toDate() - a.requestedTime.toDate();
  };

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = filteredDocs.slice(indexOfFirstFile, indexOfLastFile);
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


  const handleAuditTrailClick = (data) => {
    console.log(data);
    if (data && data.recipient) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
    } else {
      console.error("Invalid data for Audit Trail");
    }
  };
  const openDocument = async (file) => {
    const documentId = file.recipient.document_id || file.document_id;
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

      const downloadUrl = response.data.data.getDocument.signedUrl;
      window.open(downloadUrl);

      console.log(downloadUrl);
    } catch (error) {
      console.error("Error fetching document:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (user.email) {
        const q = query(collection(firestore, "sendData"));
        try {
          const querySnapshot = await getDocs(q);
          const docsData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));

          let matchingDocs = docsData.filter((doc) => {
            // Check if any addUserEmails entry matches the user's email
            const userEntry = doc.addUserEmails.find(
              (entry) => entry.email === user.email
            );

            // Filter based on status of the matching entry
            return userEntry && userEntry.status == "Signed";
          });

          // Map matchingDocs to include only the recipient entry
          matchingDocs = matchingDocs.map((doc) => {
            const recipient = doc.addUserEmails.find(
              (entry) => entry.email === user.email
            );
            return { ...doc, recipient };
          });

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
        className="receive-doc w-full max-w-10xl px-12  "
        style={{ height: "100vh" }}
      >
        <div className=" receive-doc-main">
          <h1
            className="text-2xl mb-4 mt-2"
            style={{ fontFamily: "poppins", color: "#6254B6 " }}
          >
            Signed Documents
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
              <Table className=" main-table-signed">
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
                      Sender Name
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
                      Signed Time
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
                    <TableCell
                      style={{
                        fontSize: "20px",
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
                          // onClick={() => openDocument(file)}
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
                              width: "10%",
                            }}
                            className="font-body"
                          >
                            <Link className="black-link">
                              {file.recipient.status === "Signed"
                                ? "Signed"
                                : "Not signed"}
                            </Link>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              marginLeft: "20%",
                              width: "15%",
                              padding: "4px",
                            }}
                            className="font-body"
                          >
                            {new Date(
                              file.recipient.signedTime.replace(" at ", ",")
                            ).toLocaleDateString(undefined, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) +
                              " " +
                              new Date(
                                file.recipient.signedTime.replace(" at ", ",")
                              ).toLocaleTimeString()}
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
                            <Tooltip title="Download" arrow>
                              <span
                                style={{
                                  color: "#6254B6 ",
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

export default SignedDocuments;
