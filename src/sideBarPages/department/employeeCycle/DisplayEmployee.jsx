import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { TextField, Box, Tooltip, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import axios from "axios";
// import CreateDepartment from "../createDepartment/CreateDepartment";
import DeleteConfirmationPopup from "./alertConfirmations/DeleteConfirmationPopup";
import UpdateConfirmationPopup from "./alertConfirmations/UpdateConfirmationPopup";
import Pagination from "../../../components/pagination/Pagination";
import { PiFolderNotchOpen } from "react-icons/pi";
import SubEmployeeModal from "./SubEmployeeModal/SubEmployeeModal";
import UpdateEmployeeModal from "./UpdatedModal/UpdateEmployeeModal";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { MdDragIndicator } from 'react-icons/md';

const DisplayEmployee = () => {
  const location = useLocation();
  const { departmentId } = useParams();
  const params = new URLSearchParams(location.search);
  const departmentName = params.get("departmentName") || "Unknown Folder";
  const [EmployeeList, setEmployeeList] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [editedEmployeeName, setEditedEmployeeName] = useState("");
  const [editedEmployeeTitle, setEditedEmployeeTilte] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [editedEmployeeDepart, setEditedEmployeeDepart] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [draggedEmployee, setDraggedEmployee] = useState(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(EmployeeList.length / itemsPerPage);

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = EmployeeList.slice(indexOfFirstFile, indexOfLastFile);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  // const currentFiles = EmployeeList.slice();

  const fetchEmployee = useCallback(async () => {
    setIsLoading(true);
    try {
      const employeesList = await axios.get(
        `${process.env.REACT_APP_API_URL}/departments/list_employees/?department_id=${departmentId}&user_id=${user.id}`
      );
      const allEmployees = employeesList.data;
      const userId = user.id;

      const filteredEmployees = allEmployees.filter(
        (employee) => employee.account_id === userId
      );

      const sortedEmployees = filteredEmployees.sort((a, b) => a.order - b.order);

      setEmployeeList(sortedEmployees);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, [departmentId, user.id]);


  const handleDragStart = (e, employeeId) => {
    e.dataTransfer.setData("text/plain", employeeId);
  };

  const handleDrop = async (e, targetEmployeeId) => {
    e.preventDefault();
    const sourceEmployeeId = e.dataTransfer.getData("text/plain");
    if (sourceEmployeeId && targetEmployeeId && sourceEmployeeId !== targetEmployeeId.toString()) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/departments/swap_employee/${sourceEmployeeId}/`,
          { "other_employee_id": targetEmployeeId }
        );

        if (response.data) {
          console.log(response.data.message);
          fetchEmployee();
        }
      } catch (error) {
        console.error("Error swapping employees", error.response ? error.response.data.error : error.message);
      }
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
  };


  useEffect(() => {
    if (departmentId) {
      fetchEmployee();
    }
  }, [departmentId, fetchEmployee]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
  };
  const handleOpenDeleteConfirmation = (id) => {
    setDeleteEmployeeId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteEmployeeId(null);
    setIsDeleteConfirmationOpen(false);
  };
  const handleOpenUpdateConfirmation = () => {
    setIsUpdateConfirmationOpen(true);
  };

  const handleCloseUpdateConfirmation = () => {
    setIsUpdateConfirmationOpen(false);
  };
  const handleCancelEdit = () => {
    setEditEmployeeId(null);
    setEditedEmployeeName("");
    setEditedEmployeeTilte("");
  };
  const handleEdit = (id, name, title) => {
    setEditEmployeeId(id);
    setEditedEmployeeName(name);
    // setEditedEmployeeTitle(title);
    setEditedEmployeeDepart(departmentId);
    setIsUpdateModalOpen(true);
  };
  const renderEmployeeLink = (employee) => (
    <span className="text-gray-900 dark:text-black capitalize pl-3  flex items-center">
      {editEmployeeId === employee.id ? (
        <input
          className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-purple-800 focus:outline-none"
          placeholder="employee Name"
          value={editedEmployeeName}
          onChange={(e) => setEditedEmployeeName(e.target.value)}
        />
      ) : (
        <div>{employee.name}</div>
      )}
    </span>
  );

  const handleEditEmployeeTitle = (employee) => {
    return (
      <>
        <span className="text-gray-900 dark:text-black capitalize pl-3 flex items-center">
          {editEmployeeId === employee.id ? (
            <input
              className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-purple-800 focus:outline-none"
              placeholder="employee Name"
              value={editedEmployeeTitle}
              onChange={(e) => setEditedEmployeeTilte(e.target.value)}
            />
          ) : (
            <div>{employee.title}</div>
          )}
        </span>
      </>
    );
  };

  const handleDelete = async (id) => {
    setIsDeleteConfirmationOpen(true);
    console.log(`Deleting employee with ID:`, id);
    const endpoint = `${process.env.REACT_APP_API_URL}/departments/delete_employee/${id}/`; // Include the subfolder ID in the endpoint

    try {
      await axios.delete(endpoint);

      setEmployeeList((prevEmployee) =>
        prevEmployee.filter((employee) => employee.id !== id)
      );

      console.log("employee deleted successfully");
    } catch (error) {
      console.error(`Error deleting employee`, error);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const requestData = {
        employee_name: editedEmployeeName,
        // employee_title: editedEmployeeTitle,
        department_id: departmentId,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/departments/update_employee/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        // Update the employee list if the request was successful
        setEmployeeList((prevEmployee) =>
          prevEmployee.map((employee) =>
            employee.id === id
              ? {
                ...employee,
                employee_name: editedEmployeeName,
                // employee_title: editedEmployeeTitle,
              }
              : employee
          )
        );
        setEditEmployeeId(null);
        setEditedEmployeeName("");
      } else {
        // Handle error response
        console.error("Error updating employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  return (
    <>
      {/* <div>
        <Header />
        <Sidebar />
      </div> */}
      <div
        style={{ backgroundColor: "#EBF6FF", height: "90vh" }}
        className="relative h-screen isolate overflow-hidden py-12 sm:py-8 lg:py-27 w-100 "
      >
        {" "}
        <div class="mx-auto px-6 lg:px-8 ">
          <div className="w-full p-6 bg-white rounded-2xl sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <Tooltip
              className="mb-4 flex  items-center group"
              arrow
              onClick={() => navigate("/departments")}
            >
              <button>
                <MdOutlineKeyboardBackspace size={30} />
              </button>
              <p className="group-hover:cursor-pointer px-1">Back</p>
            </Tooltip>
            <div className="flex items-center justify-between mb-4 mt-2">
              <h5 className="text-xl capitalize hover:uppercase text-gray-600 dark:text-black font-body">
                {` Departments Hierarchy - ${departmentName}`}
              </h5>
              <button
                onClick={handleOpenModal}
                type="button" // Change to type="button" to prevent form submission
                className="text-white focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
              >
                Add New Department
              </button>
            </div>

            <Box>
              <div
                style={{ border: "2px solid #6354b667" }}
                className="relative overflow-x-auto rounded-xl w-full shadow-lg"
              >
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead
                    style={{ backgroundColor: "#E4E1FA", color: "#6254B6" }}
                    class="text-base dark:bg-purple-500 dark:text-white"
                  >
                    <tr>
                      <th
                        scope="col"
                        class="px-8 py-3"
                        style={{ width: "33.33%" }}
                      >
                        Name
                      </th>
                      {/* <th
                        scope="col"
                        class="px-6 py-3"
                        style={{ width: "25%" }}
                      >
                        Title
                      </th> */}
                      <th
                        scope="col"
                        class="px-6 py-3 text-center"
                        style={{ width: "33.33%" }}
                      >
                        Email Address
                      </th>
                      <th
                        scope="col"
                        class="px-6 pl-4 pr-3 "
                        style={{ width: "33.33%" }}
                      >
                        <div className="flex items-center px-6 justify-end">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="4">
                          <p className="px-4 py-2 text-gray-700">Loading...</p>
                        </td>
                      </tr>
                    ) : EmployeeList.length === 0 ? (
                      <tr

                        className="group hover:bg-purple-50 dark:hover:bg-purple-100  border-b border-gray-200 dark:border-purple-300"
                      >                        <td colSpan="3">
                          <p className="px-4 py-3 text-gray-400 text-center">
                            No department found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentFiles.map((employee) => (
                        <tr
                          key={employee.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, employee.id)}
                          onDrop={(e) => handleDrop(e, employee.id)}
                          onDragOver={handleDragOver}
                          className="group hover:bg-purple-50 dark:hover:bg-purple-100  border-b border-gray-200 dark:border-purple-300"
                        >
                          <td className="px-8 py-3 font-body text-gray-900 dark:text-black flex items-center space-x-4">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-gray-300 text-center">
                              {employee.order}
                            </div>
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium">{employee.name}</div>
                              </div>
                            </div>
                          </td>

                          {/* <td className="px-6 py-3  font-body text-gray-900">
                            {editEmployeeId === employee.id ? (
                              <input
                                className=" p-2 rounded-md w-1/2 focus:border-purple-700 focus:outline-none"
                                placeholder="Employee title"
                                value={editedEmployeeTitle}
                                onChange={(e) =>
                                  setEditedEmployeeTilte(e.target.value)
                                }
                              />
                            ) : (
                              handleEditEmployeeTitle(employee)
                            )}
                          </td> */}
                          <td className="px-6 py-3  font-body text-gray-900 text-center">
                            {employee.email}
                          </td>
                          <td className="px-6 pl-8 pr-10 ">
                            <div className="flex items-center justify-end ">
                              <Tooltip title="Drag and Drop" arrow>
                                <button style={{ cursor: 'copy' }}>
                                  <MdDragIndicator className="mr-2 text-lg text-gray-700" />
                                </button>
                              </Tooltip>

                              <Tooltip title="Edit" arrow>
                                <button
                                  onClick={() =>
                                    handleEdit(
                                      employee.id,
                                      employee.name,
                                      employee.title
                                    )
                                  }
                                  className="inline-flex items-center  justify-center h-7 w-7 p-1  text-sm font-medium bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                  type="button"
                                >
                                  <span className="sr-only">Edit button</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-[#F29D41] group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                              <Tooltip title="Delete" arrow>
                                <button
                                  className="inline-flex items-center justify-center h-7 w-7 p-1 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                  type="button"
                                  // onClick={() => handleDelete(folder.id)}
                                  onClick={() =>
                                    handleOpenDeleteConfirmation(employee.id)
                                  }
                                >
                                  <span className="sr-only">delete button</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#FF0000"
                                    className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      // fill="#FF0000"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    {EmployeeList.length > 10 && (
                      <tr>
                        <td className=" py-[11px] px-8 text-sm text-gray-400">
                          Showing {currentPage} to {totalPages} of{" "}
                          {EmployeeList.length}
                        </td>
                        <td></td>
                        <td className=" pt-[13px] pb-[11px] px-8">
                          <div className="flex justify-end items-center">
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
            </Box>
            <SubEmployeeModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              employeeId={departmentId}
              fetchEmployee={fetchEmployee}
              departmentName={departmentName} // Add this line to pass departmentName
            />

            <UpdateEmployeeModal
              isOpen={isUpdateModalOpen}
              onClose={handleCloseModal}
              editedEmployeeName={editedEmployeeName}
              editedEmployeeTitle={editedEmployeeTitle}
              editedEmployeeDepart={editedEmployeeDepart}
              employeeId={editEmployeeId}
              fetchEmployee={fetchEmployee}
            />
          </div>
          {/* <div className="flex justify-center items-center mt-5 mb-5">
          <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(folderList.length / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />
        </div> */}
          {/* {folderList.length >= 5 && (
          <div className="flex justify-center items-center mt-5 mb-5">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(folderList.length / itemsPerPage)}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )} */}
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDelete}
        employeeId={deleteEmployeeId}
      />
      <UpdateConfirmationPopup
        isOpen={isUpdateConfirmationOpen}
        onClose={handleCloseUpdateConfirmation}
        onConfirm={() => {
          handleCloseUpdateConfirmation();
          handleSaveEdit(editEmployeeId);
        }}
      />
    </>
  );
};
export default DisplayEmployee;