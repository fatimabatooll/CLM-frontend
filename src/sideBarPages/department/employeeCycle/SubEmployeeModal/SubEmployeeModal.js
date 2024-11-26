import React, { useEffect, useState } from "react";
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

const SubEmployeeModal = ({
  isOpen,
  onClose,
  onCreateSubEmployee,
  employeeId,
  fetchEmployee,
  departmentName 
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    if (departmentName) {
      setSelectedDepartment(departmentName);
    }
  }, [departmentName]);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  const handleAddSubEmployee = async () => {
    try {
      setLoading(true);

      const requestData = {
        employee_name: employeeName,
        // employee_title: employeeTitle,
        employee_email: employeeEmail,
        department_name: departmentName,
        account_id:user.id

      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/departments/create_employee/`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setEmployeeName("");
      setEmployeeEmail("");
      // setEmployeeTitle("");
      onClose();

      toast.success("Department added successfully");

      fetchEmployee();
    } catch (error) {
      toast.error(
        error.response?.data.error || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleAddSubEmployee();
    }, 2000);
  };

  const handleClose = () => {
    setEmployeeName("");
    setEmployeeEmail("");
    // setEmployeeTitle("");
    onClose();
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
            minHeight: "150px",
          }}
        >
          <DialogActions className="mr-4">
            <h1 className="text-center text-xl font-bold font-body">
              Adding Department
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
                Add New Department
              </h1>
              <button className="px-2" onClick={handleClose}>
                <IoClose size={25} />
              </button>
            </div>
            <div className="bg-white m-[9px] rounded-2xl p-[12px]">
              <div className="flex flex-col justify-center pb-3 items-center ">
                <div className="w-full p-[16px] space-y-4">
                  <div>
                    <label className="mb-[10px] font-body font-medium">Department Name</label>
                    <input
                      className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                      type="text"
                      value={departmentName} // Populate with departmentName
                      disabled
                    />
                  </div>
                  <div className="">
                    <div>
                      <label className="mb-[10px] font-body font-medium">Name</label>
                      <input
                        id="tag"
                        type="text"
                        className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                        placeholder="Department Name"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div>
                      <label className="mb-[10px] font-body font-medium">Title</label>
                      <input
                        type="text"
                        value={employeeTitle}
                        onChange={(e) => setEmployeeTitle(e.target.value)}
                        placeholder="Department Title"
                        className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                        required
                      />
                    </div> */}
                  </div>
                  <div>
                    <label className="mb-[10px] font-body font-medium">Email</label>
                    <input
                      type="email"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      placeholder="Department Email"
                      className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogActions>
                <div className="flex justify-center items-center w-full gap-4">
                  <button
                    type="submit"
                    style={{ border: "1px #6254B6 solid" }}
                    className="text-[#6254B6] focus:ring-4 hover:bg-purple-50 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleCreateButtonClick}
                    style={{ backgroundColor: "#6254B6" }}
                    className="text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
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

export default SubEmployeeModal;
