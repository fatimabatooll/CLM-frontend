import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../../../firestore/firestore";
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
import CustomizedMenus from "./MenuTabs";
import Header from "../../../Header/header";
import Sidebar from "../../../Sidebar/Sidebar";
import Pagination from "../upload/Pagination"; // Import your Pagination component
import { Tooltip } from "@mui/material";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import AuditTrail from "../../../../auditTrail/AuditTrail";
import CircularProgress from '@mui/material/CircularProgress';

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

  const filteredDocs = receivedDocs.filter((file) => {
    const fileNameMatch = file.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const senderEmailMatch = file.senderemail
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  
    if (filterOption === "fileName") {
      return fileNameMatch && file.recipient.documentSigned;
    } else if (filterOption === "senderEmail") {
      return senderEmailMatch && file.recipient.documentSigned;
    } else if (filterOption === "Signed") {
      return file.recipient.documentSigned;
    } else if (filterOption === "NotSigned") {
      return !file.recipient.documentSigned;
    }
  
    return file.recipient.documentSigned;
  });
  
  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = filteredDocs.slice(indexOfFirstFile, indexOfLastFile);
  const handledocx = () => {
    if (selectedFile && selectedFile.fileUrl) {
      const url = selectedFile.fileUrl.split("googleapis.com")[1];
      const encodedURL = encodeURIComponent(url);
      console.log("Encoded URL:", encodedURL);
      navigate(`/wordDocx?doc=${encodedURL}`);
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };

  const handleAuditTrailClick = (data) => {
    if (data && data.recipient) {
      setSelectedAuditTrailData(data);
      setAuditTrailModalOpen(true);
    } else {
      console.error("Invalid data for Audit Trail");
    }
  };
  const openDocument = async (firestoreDocument) => {
    const { envelope_id, recipient, documentId } = firestoreDocument;
    const userEmail = recipient.email;
    localStorage.setItem("envelope_id", envelope_id);
    localStorage.setItem("signer_email", userEmail);
    const { name, clientUserId } = recipient;
    const reqUrl = `${process.env.REACT_APP_API_URL}/file/get-envelop/`;
    const reqBody = {
      authenticationMethod: "email",
      userName: name,
      clientUserId,
      email: userEmail,
      frameAncestors: [
        "http://localhost:3000/",
        "https://apps-d.docusign.com",
        "https://demo.docusign.net",
      ],
      messageOrigins: ["https://apps-d.docusign.com"],
      returnUrl: `${process.env.REACT_APP_API_URL}/aftersigning`,
      envelope_id, // Expire after 2 weeks (1209600 seconds)
    };
    const response = await axios.post(reqUrl, reqBody, {
      withCredentials: true,
    });
    const { url } = JSON.parse(response.data.message);

    // Encode the Docusign URL
    const encodedURL = encodeURIComponent(url);

    window.location.href = `/demo.html?doc=${encodedURL}`;
  };

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (user.email) {
        const q = query(collection(firestore, "sendData"));
        try {
          const querySnapshot = await getDocs(q);
          const docsData = querySnapshot.docs.map((doc) => doc.data());
          let matchingDocs = docsData.filter((doc) => {
            const addUserEmails = doc.addUserEmails || [];
            return addUserEmails.some((obj) => obj.email === user.email);
          });
          matchingDocs = matchingDocs.map((doc) => {
            const { addUserEmails, ...restOfTheDoc } = doc;
            const recipient = addUserEmails.find(
              (obj) => obj.email === user.email
            );
            return { ...restOfTheDoc, recipient };
          });

          console.log("Fetched documents:", matchingDocs);
          setReceivedDocs(matchingDocs);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching received documents:", error);
        } finally {
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
      <div className="mx-auto max-w-7xl px-12 lg:px-12 w-100">
        <div className="flex items-center justify-between -mb-14 mt-24">
          <h5 className="text-4xl font-bold leading-none ml-4 font-body mt-8">
            Signed Documents
          </h5>
        </div>

        <div className="flex items-center justify-between mt-2 mr-3 mb-4">
          <FormControl style={{ width: "19%", marginLeft: "60%" }}>
            <InputLabel id="filter-option-label">Search By Filter</InputLabel>
            <Select
              labelId="filter-option-label"
              id="filter-option-select"
              value={filterOption || ""}
              onChange={handleFilterOptionChange}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="fileName">File Name</MenuItem>
              <MenuItem value="senderEmail">Sender Email</MenuItem>
              <MenuItem value="Signed">Signed</MenuItem>
              <MenuItem value="NotSigned">Not Signed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            sx={{ width: 300, marginLeft: 2, borderRadius: "45px" }}
            variant="outlined"
            className="flex-1, font-body rounded-full"
            type="text"
            placeholder="Search files by name or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className=" max-w-10xl px-6 lg:px-0">
          {selectedFile && (
            <div style={{ marginTop: "5%" }}>
              {selectedFile && (
                <div style={{ marginBottom: "-5%" }}>
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
            className="w-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-20 sm:rounded-lg dark:focus:ring-sky-800 shadow-lg shadow-sky-8 00/50 dark:shadow-lg dark:shadow-sky-800/80 rounded-3xl"
            component={Paper}
          >
            <Table>
              <TableHead className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-16">
                <TableRow
                  style={{ borderRadius: "50px" }}
                  className="bg-cyan-500 dark:bg-cyan-600"
                >
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    File Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Sender Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "20%",
                    }}
                    className="font-body text-white"
                  >
                    Sender Email
                  </TableCell>
               
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "10%",
                    }}
                    className="font-body text-white"
                  >
                    Audit Trail
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                    <CircularProgress   size={30} />
                    </TableCell>
                  </TableRow>
                ) : filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((file, i) => (
                    <TableRow
                      key={i}
                      onClick={() => openDocument(file)}
                      sx={{
                        backgroundColor:
                          selectedFile === file ? "lightblue" : "inherit",
                        cursor: "pointer",
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
                        <Link to="#" className="black-link hover:underline">
                          {file.fileName}
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
                        <Link to="#" className="black-link hover:underline">
                          {file.owner}
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
                        <Link to="#" className="black-link hover:underline">
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
                        <Link to="#" className="black-link hover:underline">
                          {file.recipient.documentSigned
                            ? "Signed"
                            : "Not signed"}
                        </Link>
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
                    </TableRow>
                  ))
                )}
              </TableBody>
              <AuditTrail
                open={auditTrailModalOpen}
                onClose={() => setAuditTrailModalOpen(false)}
                data={selectedAuditTrailData}
              />
            </Table>
          </TableContainer>
          {filteredDocs.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-5 mb-5">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredDocs.length / itemsPerPage)}
                setCurrentPage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignedDocuments;