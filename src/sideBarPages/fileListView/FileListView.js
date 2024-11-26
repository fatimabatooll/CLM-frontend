import { BiSearchAlt } from "react-icons/bi";
import "./FileList.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Pagination from "../../components/pagination/Pagination";
import { FaMicrophoneAlt } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";
import Upload from "../../documentCycle/mainPages/Upload";
import { PiFilePdfBold } from "react-icons/pi";
import { LuSendHorizonal } from "react-icons/lu";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Tooltip } from "@material-ui/core";
import BackdropOverlay from "../../components/overlay/BackdropOverlay";
import AskMe from "./AskMe";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import ChatMe from "./ChatMe";
import Send from '../sendDoc/Send'

const FileListView = () => {
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [folderList, setFolderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [isSendDocModalOpen, setIsSendDocModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [fileIdForDelete, setFileIdForDelete] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAskMe, setOpenAskMe] = useState(false);
  

  const itemsPerPage = 4;

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
      setFirstName(obj.first_name);
      setLastName(obj.last_name);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/list/`
      );
      const files = response.data.file_list.map((file) => ({
        ...file,
        labels: [],
      }));
      const filteredFiles = files.filter(
        (file) => file.fields.account_id === user.id
      );
      setFileList(filteredFiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file list", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    // Fetch tags
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        const tagsArray = response.data.tags || [];
        const userId = user.id;
        const filteredTags = tagsArray.filter((tag) => tag.account === userId);
        const reversedTags = filteredTags.slice().reverse();
        setTags(reversedTags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };

    fetchTags();
  }, [user.id]);

  useEffect(() => {
    // Fetch folder list
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/folder/list/`
        );
        const data = await response.json();
        const filteredFolderList = data.folder_list.filter(
          (folder) => folder.account_id === user.id
        );
        setFolderList(filteredFolderList);
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };

    fetchData();
  }, [user]);

  const handledocx = (file) => {
    if (file && file.fields && file.fields.download_url) {
      const url = file.fields.download_url.trim();
      const documentId = file.fields.document_id; // Capture the document ID from the file data
      console.log("URL: ", url);
      console.log("Document ID: ", documentId); // Log the document ID to verify it's being captured correctly
  
      if (url.toLowerCase().includes(".pdf")) {
        console.log("Navigating to PDF view with document ID");
        navigate("/pdf-view", { state: { pdfUrl: url, documentId: documentId, fileId:file.pk  } });
      } else {
        console.log("Navigating to Word view with document ID");
        navigate("/word-view", { state: { otherUrl: url, documentId: documentId, fileId:file.pk  } });
      }
    } else {
      console.error("No valid download URL for the selected file.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/folder/list/`
        );
        const data = await response.json();
        setFolderList(data.folder_list);
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, "file/"); // Assuming your files are stored in 'files/' path
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/folder/list/`
        );
        const items = await listAll(storageRef);

        const files = await Promise.all(
          items.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return {
              fileName: item.name,
              downloadURL: downloadURL,
            };
          })
        );

        setFolderList(
          files.map((file) => ({
            fields: { name: file.fileName },
            downloadURL: file.downloadURL,
          }))
        );

        const data = await response.json();
        setFolderList(
          files.map((file) => ({
            fields: { name: file.fileName },
            downloadURL: file.downloadURL,
          }))
        );
        console.log(files, "");
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };
    fetchData();
  }, []);
  const handleFileSelect = (file) => {
    console.log("Currently selected file:", selectedFile);
    console.log("File clicked:", file);
    if (selectedFile && selectedFile.pk === file.pk) {
      console.log("File is already selected, keeping selection.");
      return;
    } else {
      console.log("Selecting new file.");
      setSelectedFile(file);
    }
    const selectedFileIndex = fileList.findIndex((f) => f.pk === file.pk);
    const newPage = Math.ceil((selectedFileIndex + 1) / itemsPerPage);
    setCurrentPage(newPage);
  };

  const handleOpenDeleteModal = (fileId) => {
    setFileIdForDelete(fileId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteConfirmationOpen(false);
    setFileIdForDelete(null);
  };
  const handleDelete = async (fileId) => {
    setIsDeleteConfirmationOpen(true);
    try {
      if (fileId === undefined) {
        console.error("File ID is undefined. Skipping delete.");
        return;
      }
      console.log("Deleting file with ID:", fileId);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/file/delete/${fileId}/`
      );
      const updatedFileList = fileList.filter((file) => file.pk !== fileId);
      setFileList(updatedFileList);
      if (selectedFile && selectedFile.pk === fileId) {
        setSelectedFile(null);
      }
      setIsDeleteConfirmationOpen(false);
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  useEffect(() => {
    console.log("Selected File:", selectedFile);
  }, [selectedFile]);

  const handleFilesSelect = (file) => {
    setSelectedFile(file);
  };

  const handleShareOrSend = (file) => {
    if (file && file.pk) {
      const fileUrl = file.fields.download_url;
      const fileName = file.fields.name;
      const fileId = file.pk;

      if (fileUrl && fileId) {
        console.log("Selected File:", file);
        setSelectedFile(file); // Set selectedFile here
        setIsSendDocModalOpen(true);
      } else {
        console.error("Invalid file information for the selected file.");
      }
    } else {
      console.error("No valid file information for the selected file.");
    }
  };

  const handleFileDownload = (file) => {
    if (file) {
      const anchor = document.createElement("a");
      anchor.href = file.fields.download_url;
      anchor.download = file.fields.name;
      anchor.click();
    }
  };

  const toggleTagInArray = (array, tag) => {
    const index = array.indexOf(tag);
    if (index === -1) {
      return [...array, tag];
    } else {
      const updatedTags = [...array];
      updatedTags.splice(index, 1);
      return updatedTags;
    }
  };

  const handleLabelSelect = (label) => {
    // Check if there is a selected file
    if (!selectedFile || !selectedFile.pk) {
      console.error("No selected file or file ID. Aborting tag update.");
      return;
    }
    const fileId = selectedFile.pk;
    setSelectedTags((prevTags) => toggleTagInArray(prevTags, label));
    setFileList((prevFileList) => {
      const updatedFileList = prevFileList.map((file) =>
        file.pk === fileId
          ? {
              ...file,
              fields: {
                ...file.fields,
                tags: toggleTagInArray(file.fields.tags, label),
              },
            }
          : file
      );
      return updatedFileList;
    });
  };
  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;

  const filteredFiles = fileList.filter((file) => {
    const nameMatch =
      file.fields &&
      file.fields.name &&
      file.fields.name.toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch =
      file.fields &&
      file.fields.tags &&
      file.fields.tags.some(
        (tag) =>
          tag.name &&
          typeof tag.name === "string" &&
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const folderMatch =
      file.fields &&
      file.fields.folder &&
      file.fields.folder.toLowerCase().includes(searchQuery.toLowerCase());

    if (!filterOption) {
      return nameMatch || tagsMatch || folderMatch;
    } else if (filterOption === "fileName") {
      return nameMatch;
    } else if (filterOption === "tags") {
      return tagsMatch;
    } else if (filterOption === "folder") {
      return folderMatch;
    }

    return true;
  });
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  console.log(currentFiles, "dfdsf=============fdsdf=========");

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
  };

  const handleOpenSubfolderModal = () => {
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
  };

  const handleAskMe = () => {
    setOpenAskMe(true);
    navigate("/ask-me");
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#EBF6FF" }}
        className="mx-auto px-8 w-100 h-auto"
      >
        <div className=" w-full px-6 bg-white rounded-xl py-3  mt-[14px]">
          <div className=" grid grid-cols-3">
            <div className="search-container-filelist">
              <input
                type="text"
                placeholder="Search files by names or tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <BiSearchAlt className="search-icon-filelist" /> */}
            </div>
            <div className="flex items-center justify-between mt-2 mr-2 mb-4">
              <div style={{ width: "50%", marginLeft: "50%" }}>
                <select
                  className="filters-filelist"
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
                  <option value="" disabled hidden>
                    Search By Filter
                  </option>
                  <option value="fileName">File Name</option>
                  <option value="tags">Labels</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleOpenSubfolderModal}
              type="submit"
              class="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-sm  w-[40%] text-center mb-2 font-body"
              style={{ backgroundColor: "#6254B6" }}
            >
              Add New Documents
            </button>
          </div>

          <div
            style={{ border: "2px solid #6354b667" }}
            className="w-full shadow-lg text-sm text-left dark:text-black-400 mt-6 sm:rounded-lg rounded-3xl overflow-hidden"
          >
            <table className="w-full">
              <thead
                style={{ backgroundColor: "#E4E1FA", color: "#6254B6" }}
                class="text-base dark:bg-purple-500 dark:text-white"
              >
                <tr style={{ borderRadius: "50px" }}>
                  <th
                    className="font-body text-left py-3 pl-4 pr-2"
                    style={{ width: "20%" }}
                  >
                    File Name
                  </th>
                  <th
                    className="font-body text-left py-3 pr-2"
                    style={{ width: "20%" }}
                  >
                    Owner
                  </th>
                  <th
                    className="font-body text-left py-3 pr-2"
                    style={{ width: "20%" }}
                  >
                    Folder
                  </th>
                  <th
                    className="font-body text-left py-3 pr-2"
                    style={{ width: "20%" }}
                  >
                    Date
                  </th>
                  <th
                    className="font-body text-left py-3 pr-2"
                    style={{ width: "20%" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-3">
                        <CircularProgress size={30} />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredFiles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-3">
                            No documents found.
                          </td>
                        </tr>
                      ) : (
                        filteredFiles
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((file, i) => (                          
                        <tr
                            key={file.pk}
                            onClick={() => handleFileSelect(file)}
                            className={`${
                              selectedFile === file ? "bg-purple-100" : ""
                            } group hover:bg-gray-50 dark:hover:bg-purple-100 border-b border-gray-200 dark:border-purple-300`}
                          >
                            <td
                              className="font-body text-left py-3 pl-3"
                              style={{ width: "25%" }}
                            >
                              <Link className="black-link">
                                {file.fields.name}
                                {file.fields.tags &&
                                  file.fields.tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-0.3 rounded-full mr-2 ml-2 text-sm"
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: selectedTags.includes(
                                          tag.name
                                        )
                                          ? "blue"
                                          : tag.color,
                                        color: "white",
                                        marginRight:
                                          index < tag.length - 1 ? "8px" : "0",
                                      }}
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                              </Link>
                            </td>
                            <td
                              className="font-body text-left py-3 pr-2"
                              style={{ width: "25%" }}
                            >
                              <Link className="black-link">{`${firstName} ${lastName}`}</Link>
                            </td>
                            <td
                              className="font-body py-3 pr-2"
                              style={{ width: "25%" }}
                            >
                              <p className="text-sm">
                                {file.fields.folder
                                  ? file.fields.folder
                                  : "------"}
                              </p>
                            </td>
                            <td
                              className="font-body text-left py-3 pr-2"
                              style={{ width: "25%" }}
                            >
                              <p className="text-sm">
                                {file.fields.created_at
                                  ? format(
                                      new Date(file.fields.created_at),
                                      "dd MMMM yyyy"
                                    )
                                  : "------"}
                              </p>
                            </td>
                            <td
                              className="font-body text-left py-3 pr-3"
                              style={{ width: "25%" }}
                            >
                              <div className="flex space-x-2">
                                <td>
                                  <Tooltip title="Open" arrow>
                                    <button
                                      onClick={() => handledocx(file)}
                                      className="text-[#F29D41]"
                                    >
                                      <PiFilePdfBold size={23} />
                                    </button>
                                  </Tooltip>
                                </td>
                                <td>
                                  <Tooltip title="Send" arrow>
                                    <button
                                      onClick={() => handleShareOrSend(file)}
                                      className="text-[#F29D41]"
                                    >
                                      <LuSendHorizonal size={23} />
                                    </button>
                                  </Tooltip>
                                </td>
                                <td>
                                  <Tooltip title="Download" arrow>
                                    <button
                                      onClick={() => handleFileDownload(file)}
                                      className="text-[#F29D41]"
                                    >
                                      <HiOutlineDocumentDownload size={23} />
                                    </button>
                                  </Tooltip>
                                </td>
                                <td>
                                  <Tooltip title="Delete" arrow>
                                    <button
                                      onClick={() =>
                                        handleOpenDeleteModal(file.pk)
                                      }
                                      className="text-red"
                                    >
                                      <RiDeleteBin6Line size={23} />
                                    </button>
                                  </Tooltip>
                                </td>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </>
                  )}
                </>
                {/* ); */}

                {isSendDocModalOpen && (
                  <>
                    <BackdropOverlay />
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-40%, -58%)",
                        zIndex: "1000",
                        width: "80%",
                        height: "60%",
                      }}
                    >
                      {console.log(
                        "Value of selectedFile before rendering SendDocModal:",
                        selectedFile
                      )}
                      <Send
                        onClose={() => setIsSendDocModalOpen(false)}
                        file={selectedFile}
                      />
                      {console.log(
                        "Value of selectedFile after rendering SendDocModal:",
                        selectedFile
                      )}
                    </div>
                  </>
                )}
              </tbody>
              <tfoot>
                {filteredFiles.length > 4 && (
                  <tr className="*:pl-2">
                    <td className=" py-[11px] text-sm text-gray-400 pl-3">
                      Showing {currentPage} to {totalPages} of{" "}
                      {filteredFiles.length}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className=" pt-[13px] pb-[11px]">
                      <div className="flex justify-end items-center mr-3">
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
            </table>
          </div>
        </div>

        <div className="ask-me">
          <div className="bg-white p-2 my-3 rounded-xl w-full hover:cursor-pointer">
            <ChatMe />
          </div>
        </div>
        <Upload
          isOpen={openUploadModal}
          onClose={handleCloseUploadModal}
          fetchData={fetchData}
        />
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        fileId={fileIdForDelete}
      />
    </>
  );
};
export default FileListView;