
// CreateSubfolderModal.js

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import axios from "axios";
import { toast } from "sonner";
import CircularProgress from "@mui/material/CircularProgress";
import { IoClose } from "react-icons/io5";

const SubFolderModal = ({
  isOpen,
  onClose,
  onCreateSubfolder,
  folderId,
  fetchData,
}) => {
  const [inputValue, setInputValue] = useState("");

  const [subfolderName, setSubfolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setSubfolderName(e.target.value);
  };

  const handleAddSubFolder = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", subfolderName);
      formData.append("parent", folderId);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/folder/add/`,
        formData,
        {
          withCredentials: true,
        }
      );

      setInputValue("");
      setSubfolderName("");
      onClose();

      toast.success("Subfolder created successfully");

      fetchData();
    } catch (error) {
      console.error("Error creating subfolder:", error);
      console.log("Server response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleAddSubFolder();
    }, 2000);
  };
  return (
    <Dialog
  open={isOpen}
  onClose={onClose}
  style={loading ? { minHeight: "150px" } : {}}
  PaperProps={{
    style: {
      borderRadius: "15px",
      width: '800px'
    },
  }}
>
  {loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "150px",
      }}
    >
      <DialogActions className="mr-4">
        <h1 className="text-center text-xl font-bold font-body">
          Creating folder
        </h1>
        <CircularProgress size={30} />
      </DialogActions>
    </div>
  ) : (
    <>
      <div style={{ backgroundColor: "#EBF6FF",}} className=" p-3 ">
          <div className="flex justify-between">

          <h1 style={{ fontWeight: 700, fontSize: '20px', lineHeight: '24.2px', color: '#07224D' }} className="text-start font-body px-2 py-[10px]">
          Create Subfolder
        </h1>
        <button className="px-2" onClick={onClose}><IoClose size={25}/></button>
          </div>
          <div className="bg-white m-[9px] rounded-2xl p-[12px]">
      <DialogContent className="flex flex-col justify-center pb-3 items-center ">
        <input
          id="tag"
          className="border-2 border-gray-400 p-[12px] text-start w-full rounded-lg focus:outline-none"
          placeholder="sub-folder name"
          value={subfolderName}
          onChange={(e) => handleInputChange(e)}
        />
      </DialogContent>
      <DialogActions>

        <div className="flex justify-center items-center w-full gap-4">
          <button
            type="submit"
            style={{border: '1px #6254B6 solid'}}
            className="text-[#6254B6] focus:ring-4 hover:bg-purple-50 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
        onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{backgroundColor: '#6254B6'}}
            className="text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
        onClick={handleCreateButtonClick}
            disabled={loading}
          >
            Create
          </button>
          </div>
          </DialogActions>
          </div>
      </div>
    </>
  )}
</Dialog>
  );  
};

export default SubFolderModal;
