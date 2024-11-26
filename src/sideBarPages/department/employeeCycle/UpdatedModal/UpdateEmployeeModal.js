// CreateSubfolderModal.js

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
import UpdateConfirmationPopup from "../alertConfirmations/UpdateConfirmationPopup";


const UpdateEmployeeModal = ({
  isOpen,
  onClose,
  editedEmployeeName,
  editedEmployeeTitle,
  editedEmployeeDepart,
  employeeId,
  fetchEmployee
}) => {
  const [employeeName, setEmployeeName] = useState(editedEmployeeName);
  const [employeeTitle, setEmployeeTitle] = useState(editedEmployeeTitle);
  const [employeeEmail, setEmployeeEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(editedEmployeeDepart);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
  useState(false);
  const [user, setUser] = useState({});


  const handleOpenUpdateConfirmation = () => {
    setIsUpdateConfirmationOpen(true);
  };

  const handleCloseUpdateConfirmation = () => {
    setIsUpdateConfirmationOpen(false);
  };
  

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  useEffect(() => {
    // This effect will run whenever `editedEmployeeName` or `editedEmployeeTitle` props change
    setEmployeeName(editedEmployeeName);
    // setEmployeeTitle(editedEmployeeTitle);
    setSelectedDepartment(editedEmployeeDepart)
  }, [editedEmployeeName, editedEmployeeTitle, editedEmployeeDepart]);
  
  console.log('update, ,,;fwfkwf: ',employeeName, selectedDepartment,'employee',employeeId)
  const handleDepartmentNames = async () => {
    const response = await axios.get(
      "http://localhost:8000/departments/list_departments/",
      {
        withCredentials: true,
      }
    );


    const userId = user.id;

        const departmentsArray = response.data.departments || [];
        const filteredDepartments = departmentsArray.filter( 
          (departments) => departments.account_id === userId
        );
    setDepartmentList(filteredDepartments);
    console.log(
      "Fetched departments in employee modal:",
      departmentList
    );
  };

  const handleSaveEdit = async () => {
    try {
      const requestData = {
        employee_name: employeeName,
        // employee_title: employeeTitle,
        department_id: selectedDepartment,
      };
    
      console.log(requestData)

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/departments/update_employee/${employeeId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        console.log('employee updated:')
        setLoading(false)
        fetchEmployee();
        onClose();
      }
      //   // Update the employee list if the request was successful
      //   setEmployeeList((prevEmployee) =>
      //     prevEmployee.map((employee) =>
      //       employee.id === id
      //         ? {
      //             ...employee,
      //             employee_name: editedEmployeeName,
      //             employee_title: editedEmployeeTitle,
      //           }
      //         : employee
      //     )
      //   );
      //   setEditEmployeeId(null);
      //   setEditedEmployeeName("");
      //   setEditedEmployeeTilte("");

      //   fetchEmployee();
      // } else {
      //   // Handle error response
      //   console.error("Error updating employee:", response.statusText);
      // }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // const handleAddSubEmployee = async () => {
  //   try {
  //     setLoading(true);

  //     const requestData = {
  //       employee_name: employeeName,
  //       employee_title: employeeTitle,
  //       employee_email: employeeEmail,
  //       department_name: selectedDepartment,
  //     };

  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/departments/create_employee/`,
  //       requestData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     setEmployeeName(editedEmployeeName);
  //     setEmployeeTitle(editedEmployeeTitle);
  //     setSelectedDepartment('');
  //     onClose();

  //     toast.success("Employee added successfully");
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data.error || error.message || "An error occurred"
  //     );
  //     // console.error("Error adding employee:", error);
  //     // console.log("Server response:", error.response?.data.error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateButtonClick = () => {
    
    setLoading(true);
    setTimeout(() => {
      handleSaveEdit();
    }, 2000);
  };

  useEffect(() => {
    handleDepartmentNames();
  }, [employeeId]);

  const handleFilterOptionChange = (event) => {
    setSelectedDepartment(event.target.value);
    // setSelectedDepartmentID(event.target.id)
    console.log("SelectedDepartment:", selectedDepartment);
  };

  const handleClose = () => {
    setEmployeeName(editedEmployeeName);
    // setEmployeeTitle(editedEmployeeTitle);
    setSelectedDepartment(editedEmployeeDepart);
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
              Updating Department
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
                Update the Employee
              </h1>
              <button className="px-2" onClick={handleClose}>
                <IoClose size={25} />
              </button>
            </div>
            {/* <form onSubmit={handleCreateButtonClick}> */}
            <div className="bg-white m-[9px] rounded-2xl p-[12px]">
              <div className="flex flex-col justify-center pb-3 items-center ">
                <div className="w-full p-[16px] space-y-4">
                  <div>
                    <label className="mb-[10px] font-body font-medium">Department Name</label>
                    <select
                      className={`${selectedDepartment && 'text-gray-700 '} border-2 border-gray-300 text-gray-400  focus:outline-none`}
                      id="filter-option-select"
                      value={selectedDepartment || ""}
                      onChange={handleFilterOptionChange}
                      style={{
                        width: "100%",
                        padding: "12px 8px",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }}
                      required
                    >
                      <option value="" className={`py-2.5  ${selectedDepartment && 'text-gray-600 '} focus:outline-none`}>
                        Select Department
                      </option>
                      {departmentList.map((department) => (
                        <option key={department.id} value={department.id} >
                          {department.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="">
                    <div>
                      <label className="mb-[10px] font-body font-medium">Name</label>
                      <input
                        id="tag"
                        type="text"
                        className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                        placeholder="employee name"
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
                        placeholder="employee title"
                        className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                        required
                      />
                    </div> */}
                  </div>
                  {/* <div>
                    <label className="mb-[10px] font-body font-medium">Email</label>
                    <input
                      type="email"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      placeholder="employee email"
                      className="border-2 border-gray-300 p-[12px] text-start w-full rounded-lg focus:outline-none"
                      required
                    />
                  </div> */}
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
                    Update
                  </button>
                </div>
              </DialogActions>
            </div>
            {/* </form> */}
          </div>
        </>
      )}
      <UpdateConfirmationPopup
        isOpen={isUpdateConfirmationOpen}
        onClose={handleCloseUpdateConfirmation}
        onConfirm={() => {
          handleCloseUpdateConfirmation();
          handleSaveEdit(employeeId);
        }}
      />
    </Dialog>
  );
};

export default UpdateEmployeeModal;
