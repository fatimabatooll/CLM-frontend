import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
const UpdateConfirmationPopup = ({isOpen, onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
      setIsLoading(true);
  
      setTimeout(() => {
        setIsLoading(false);
        onConfirm();
      }, 2000);
    };

  return (
    <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Update Confirmation</DialogTitle>
    <DialogContent>
      <p>Are you sure you want to update?</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        No
      </Button>
      <Button onClick={handleConfirm} color="primary" disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : "Yes"}
      </Button>
    </DialogActions>
  </Dialog>  )
}
export default UpdateConfirmationPopup;
