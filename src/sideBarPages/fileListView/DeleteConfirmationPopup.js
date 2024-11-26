import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { IoClose } from "react-icons/io5";

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, fileId }) => {
  const [loading, setLoading] = useState(false);

  const handleYesClick = async () => {
    try {
      setLoading(true);
      await onConfirm(fileId);
      // Simulate a 2-second delay before closing the dialog
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error deleting file", error);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "15px",
          width: "900px", // Set the border radius here
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
            minHeight: "200px",
          }}
        >
          <DialogActions className="mt-1 mr-4">
            <h1 className="text-center text-xl font-bold font-body">
              Deleting File
            </h1>
            <CircularProgress size={30} />
          </DialogActions>
        </div>
      ) : (
        <>
          <div style={{ backgroundColor: "#EBF6FF" }} className=" p-3 ">
            <div className="flex justify-between">
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "24.2px",
                  color: "#07224D",
                }}
                className="text-start font-body px-2 py-[10px]"
              >
                Confirmation
              </h1>
              <button className="px-2" onClick={onClose}>
                <IoClose size={25} />
              </button>
            </div>
            <div className="bg-white m-[9px] flex flex-col justify-center items-center rounded-2xl p-[12px]">
              <DialogContent>
                Are you sure you want to delete this File?
              </DialogContent>
              <DialogActions>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    style={{ border: "1px #6254B6 solid" }}
                    className="text-[#6254B6] focus:ring-4 hover:bg-purple-50 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: "#D84848" }}
                    className="text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
                    onClick={handleYesClick}
                    disabled={loading}
                  >
                    Delete
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

export default DeleteConfirmationPopup;
