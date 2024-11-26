import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

export const CreateDepartment = ({ isOpen, onClose, fetchData }) => {
    const [inputValue, setInputValue] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [personName, setPersonName] = useState("");
    const [personEmail, setPersonEmail] = useState("");

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
  
    // const handleInputChange = (e) => {
    //   setInputValue(e.target.value);
    // };
  
    useEffect(() => {
      const obj = JSON.parse(localStorage.getItem("user"));
      if (
        obj &&
        (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
      ) {
        setUser(obj);
      }
    }, [user]);
  
    const createDepartment = async () => {
      try {
        setLoading(true);
    
        const requestData = {
          department_name: departmentName,
          account_id:user.id
        };
    
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/departments/create/`,
          requestData,
          {
            withCredentials: true,
          }
        );
    
        setInputValue("");
        setDepartmentName("");
        onClose();
        toast.success("Department Hierarchy created successfully");
        fetchData();
      } catch (error) {
        console.error("Error creating departments hierarchy", error);
        toast.error(error.response.data.error);

      } finally {
        setLoading(false);
      }
    };
    
  
    const handleCreateButtonClick = () => {
      setLoading(true);
      setTimeout(() => {
        createDepartment();
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
        width: "800px", 
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
            Creating Departments Hierarchy
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
              Create New Departments Hierarchy
            </h1>
            <button className="px-2" onClick={onClose}>
              <IoClose size={25} />
            </button>
          </div>
          <div className="bg-white m-[9px] rounded-2xl p-[12px]">
            <DialogContent className="flex flex-col justify-center  items-center ">
              <input
                id="tag"
                className="border-2 border-gray-400 p-[12px] text-start w-full rounded-lg focus:outline-none"
                placeholder="Name your departments hierarchy"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </DialogContent>

            <DialogActions>
              <div className="flex justify-center items-center w-full gap-4">
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
                  style={{ backgroundColor: "#6254B6" }}
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
  </Dialog> )
}
