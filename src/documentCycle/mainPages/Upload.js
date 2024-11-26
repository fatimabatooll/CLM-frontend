import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Folder from "../folderCycle/folderDropdown/Folder";
import Label from "../labelCycle/labelDropdown/Label";
import { firestore } from "../../firestore/firestore";
import { addDoc, collection, Timestamp } from "@firebase/firestore";
import {
  getStorage,
  ref as Storage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "sonner";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import CardActions from "@mui/material/CardActions";
import { IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Dialog } from "@mui/material";

const Upload = ({ handleCloseSubfolderModal, isOpen, onClose, fetchData }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [user, setUser] = useState({});
  const [owner, setOwner] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileref = useRef();
  const ref = collection(firestore, "file");
  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);
  const handleOwnerChange = (e) => {
    setOwner(e.target.value);
  };
  const handleFolderChange = (folderName) => {
    setSelectedFolder((prevFolder) =>
      prevFolder === folderName ? "" : folderName
    );
  };
  const handleTagSelection = (tag) => {
    setNewTag(tag);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["pdf", "docx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Unsupported file type. Please upload a valid document.");
      setSelectedFile(null);
      setUploadedFileName("");
      return;
    }
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };
  const handleUpload = async () => {
    try {
      setIsLoading(true);
      if (!selectedFile) {
        console.error("No file selected for upload");
        return;
      }
      const uniqueFileName = `${Date.now()}_${selectedFile.name}`;
      const storage = getStorage();
      const storageRef = Storage(storage, `file/${uniqueFileName}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const fileData = {
        fileName: selectedFile.name,
        downloadURL: downloadURL,
        timestamp: Timestamp.fromDate(new Date()),
      };
      const docRef = await addDoc(ref, fileData);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", selectedFolder);
      formData.append("new_tag", newTag);
      formData.append("download_url", downloadURL);
      formData.append("account", user.id);

      console.log("FormData Document ID:", formData.get("document_id"));
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/add/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.success("File uploaded successfully");
        console.log("File uploaded successfully");
        console.log(response.data);
        setUploadedFileName("");
        onClose();
        fetchData();
        navigate("/file-list");
      }
      console.log("File uploaded successfully");
      console.log("Firestore document ID:", docRef.id);
      console.log("Download URL:", downloadURL);
      setUploadedFileName("");
    } catch (error) {
      toast.error("Error uploading file");
      console.error("Error uploading file", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        setTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        setTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTags();
  }, []);
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        style={isLoading ? { minHeight: "150px" } : {}}
        PaperProps={{
          style: {
            borderRadius: "15px",
            width: "900px", // Set the border radius here
          },
        }}
      >
        <div
          style={{ backgroundColor: "#EBF6FF" }}
          className=" flex flex-col justify-center items-center w-[600px] h-auto rounded-2xl z-40"
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "24.2px",
              color: "#07224D",
            }}
            className="flex justify-between w-full px-[35px] pb-3 pt-[28px] "
          >
            <h1> Add New Document</h1>
            <button className="hover:cursor-pointer " onClick={onClose}>
              <IoClose size={23} />
            </button>
          </div>
          <form>
            <div className="relative bg-white px-[30px] pt-[30px] pb-[24px] mx-[27px] mb-[27px] rounded-2xl">
              <button
                type="submit"
                class="filelist-button text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-md text-sm  w-[40%] text-center mb-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
                onClick={() => navigate("/editor")}
              >
                Create New Document
              </button>
              {isLoading && (
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(5px)",
                      zIndex: 9998,
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "8%",
                      right: '50%',
                      transform: "translate(-25%, -50%)",
                      zIndex: 9999,
                    }}
                  >
                    <div>
                      <p className="text-cyan-800 mb-2">{uploadedFileName}</p>
                    </div>
                    <LinearProgress style={{ width: "50vw" }} />
                    <CardActions>
                      <CircularProgress size={30} />
                      <p>Uploading file...</p>
                    </CardActions>
                  </div>
                </>
              )}
              <div className="flex flex-col items-center space-y-4 ">
                <div className="sm:col-span-2 sm:col-start-1 w-full">
                  <label
                    htmlFor="owner"
                    className="block text-sm leading-6 text-[#07224D] font-bold"
                  >
                    Owner
                  </label>
                  <div className="mt-2">
                    <select
                      id="owner"
                      value={owner}
                      onChange={handleOwnerChange}
                      style={{ color: "black" }}
                      className="border-2 border-gray-300 px-3 py-[11px] rounded-md w-full focus:outline-none"
                    >
                      <option>
                        {user.first_name} {user.last_name}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2 w-full">
                  <label
                    htmlFor="folder"
                    className="block text-sm leading-6 text-[#07224D] font-bold"
                  >
                    Folder
                  </label>
                  <div className="mt-1.5">
                    <Folder onSelect={handleFolderChange} />
                  </div>
                </div>
                <div className="sm:col-span-2 w-full">
                  <label
                    htmlFor="label"
                    className="block text-sm leading-6 text-[#07224D] font-bold"
                  >
                    Label
                  </label>
                  <div className="mt-1.5">
                    <Label onSelect={handleTagSelection} />
                  </div>
                </div>
              </div>
              {/* Centered document upload div */}
              <div className="mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 ">
                  <div
                    className="sm:col-span-2 mx-auto text-center "
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <label
                      htmlFor="file-upload"
                      // style={{backgroundColor: '#36489E'}}
                      className="p-8  w-full hover:cursor-pointer bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 mx-auto"
                    >
                      <div className="flex justify-center items-center">
                        <p
                          style={{ border: "1px #6254B6 solid" }}
                          className="text-[#6254B6] focus:ring-4 hover:bg-purple-50 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 rounded-lg text-sm px-4 py-2.5 text-center mb-2 font-body"
                        >
                          Upload File
                        </p>
                      </div>
                      <span className=" text-gray-600 block text-base">
                        Drag and drop or{" "}
                        <span className="text-[#6254B6]">Browse</span>
                      </span>
                      <span className="text-gray-400 text-sm pt-2 block">
                        Supported Formats: PDF, DOC, DOCX, RTF, PPT, PPTX, JPEG,
                        PNG, or TXT
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <div className="sm:col-span-2 text-center">
                    <div>
                      <p className="text-[#07224D] mb-2">{uploadedFileName}</p>
                    </div>
                    <button
                      type="button"
                      style={{ backgroundColor: "#6254B6" }}
                      className="text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
                      onClick={handleUpload}
                      disabled={isLoading}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </form>
        </div>
      </Dialog>
    </>
  );
};
export default Upload;