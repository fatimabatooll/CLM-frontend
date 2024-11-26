import React, { useState, useEffect } from "react";
import "../department/Department.css";
import { CreateDepartment } from "./createDepartment/CreateDepartment";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { PiFolderOpen } from "react-icons/pi";
import { FiEdit2 } from "react-icons/fi";
import { TextField, Box, Tooltip, CircularProgress } from "@mui/material";
import axios from "axios";
import DeleteConfirmationPopup from "../department/alertConfirmation/DeleteConfirmationPopup";
import UpdateConfirmationPopup from "../department/alertConfirmation/UpdateConfirmationPopup";
import Pagination from "../../components/pagination/Pagination";
import { RiDeleteBin6Line } from "react-icons/ri";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400.css";

export const Department = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editedDepartmentName, setEditedDepartmentName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState({});
  const [isLoadingDep, setIsLoadingDep] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(departmentList.length / itemsPerPage);

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;

  const currentFiles = departmentList.slice(indexOfFirstFile, indexOfLastFile);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenDeleteConfirmation = (id) => {
    setDeleteDepartmentId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteDepartmentId(null);
    setIsDeleteConfirmationOpen(false);
  };
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

  const fetchDepartment = async () => {
    setIsLoadingDep(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/departments/list_departments/`,
        {
          withCredentials: true,
        }
      );
      console.log("Fetched departments:", response.data);
      const userId = user.id;

      const departmentsArray = response.data.departments || [];
      const filteredDepartments = departmentsArray.filter(
        (departments) => departments.account_id === userId
      );
      setDepartmentList(filteredDepartments);
    } catch (error) {
      console.error("Error fetching departments", error);
    } finally {
      setIsLoadingDep(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [user]);
  // const handleDelete  = async (Id) => {
  //   const apiUrl = `${process.env.REACT_APP_API_URL}/departments/${Id}/delete/`;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: 'DELETE'
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete department');
  //     }

  //     return true; // Return true if deletion is successful
  //   } catch (error) {
  //     console.error('Error deleting department:', error);
  //     return false; // Return false if deletion fails
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/departments/${id}/delete/`,
        {
          method: "DELETE",
        }
      );
      setDepartmentList((prevDepartments) => {
        if (prevDepartments === null) {
          return [];
        }
        return prevDepartments.filter((department) => department.id !== id);
      });
    } catch (error) {
      console.error("Error deleting department", error);
    }
  };
  const handleEdit = (id, name) => {
    setEditDepartmentId(id);
    setEditedDepartmentName(name);
  };
  const handleCancelEdit = () => {
    setEditDepartmentId(null);
    setEditedDepartmentName("");
  };
  const handleSaveEdit = async (id) => {
    const updateEndpoint = `${process.env.REACT_APP_API_URL}/departments/${id}/update_name/`;
    try {
      const response = await axios.put(updateEndpoint, {
        department_name: editedDepartmentName,
      });
      setDepartmentList(
        departmentList.map((department) =>
          department.id === id
            ? { ...department, department_name: editedDepartmentName }
            : department
        )
      );
      setEditDepartmentId(null);
      setEditedDepartmentName("");
      handleOpenUpdateConfirmation();
    } catch (error) {
      console.error("Error updating department", error);
    }
  };
  const renderDepartmentLink = (department) => (
    <Link
      to={`/departments/${department.id}?departmentName=${encodeURIComponent(
        department.department_name
      )}`}
      className="flex items-center"
    >
      <div
        style={{
          backgroundColor: "",
        }}
      ></div>
      <span className="text-gray-900 dark:text-black text-lg">
        {editDepartmentId === department.id ? (
          <input
            className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-sky-700 focus:outline-none"
            placeholder="department Name"
            value={editedDepartmentName}
            onChange={(e) => setEditedDepartmentName(e.target.value)}
          />
        ) : (
          department.department_name
        )}
      </span>
    </Link>
  );

  return (
    <>
      {/* <div>
      <Header />
      <Sidebar />
    </div> */}
      <div
        style={{ height: "90vh" }}
        className="relative h-screen isolate overflow-hidden py-12 sm:py-8 lg:py-27 w-100 main-department"
      >
        <div class="mx-auto px-6 lg:px-8 ">
          <div className="w-full p-6 bg-white rounded-2xl sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 mt-2">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black font-body sm:rounded-lg">
                Manage Departments Hierarchy
                <p class="mt-0 text-sm leading-8 text-gray-500 font-body">
                  Group documents, sign requests, or templates into departments
                  to organize your content.
                </p>
              </h5>
              <button
                onClick={handleOpenModal}
                type="submit"
                class="text-white focus:ring-4  focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
              >
                Create New Department Hierarchy
              </button>
            </div>
            {isLoadingDep ? (
              <div className="flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : departmentList.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No departments found.
              </p>
            ) : (
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
                          class="px-6 py-4"
                          style={{ color: "#6254B6" }}
                        >
                          Departments
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-4 "
                          style={{ color: "#6254B6" }}
                        >
                          <div className="flex items-center justify-end mr-4">
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFiles.map((department) => (
                        <tr
                          // key={department.id}
                          className="group hover:bg-purple-50 dark:hover:bg-gray-100  border-b  dark:border-gray-300"
                        >
                          <td className="px-6 py-3   font-body text-gray-900 dark:text-black capitalize">
                            {editDepartmentId === department.id ? (
                              <input
                                className="border-2 border-gray-500 p-2 text-base rounded-md w-1/2 focus:border-purple-700 focus:outline-none"
                                placeholder="Department Name"
                                value={editedDepartmentName}
                                onChange={(e) =>
                                  setEditedDepartmentName(e.target.value)
                                }
                              />
                            ) : (
                              renderDepartmentLink(department)
                            )}
                          </td>

                          {/* <td className="px-6 py-3   font-body text-gray-900 dark:text-black">
                            {editDepartmentId === department.id ? (
                              <input
                                className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-cyan-700 focus:outline-none"
                                placeholder="department Name"
                                value={editedDepartmentName}
                                onChange={(e) =>
                                  setEditedDepartmentName(e.target.value)
                                }
                              />
                            ) : (
                              renderDepartmentLink(department)

                            )}
                          </td> */}
                          <td className="">
                            <div className="flex items-center justify-end mr-4">
                              {editDepartmentId === department.id ? (
                                <>
                                  <Tooltip title="update changes" arrow>
                                    <button
                                      onClick={handleOpenUpdateConfirmation}
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only px-6">
                                        Save Changes
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Cancel" arrow>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only">
                                        Cancel button
                                      </span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-500 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-800"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <Tooltip title="Edit" arrow>
                                    <button
                                      onClick={() =>
                                        handleEdit(
                                          department.id,
                                          department.department_name
                                        )
                                      }
                                      className="inline-flex items-center text-[#F29D41] group-hover:text-gray-800 justify-center h-7 w-7 p-1 ml-3 text-sm font-medium bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <div>
                                        <FiEdit2 size={19} />
                                      </div>
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <button
                                      className="inline-flex items-center justify-center h-7 w-7 p-1  text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                      // onClick={() => handleConfirmDelete(department.id)}
                                      onClick={() =>
                                        handleOpenDeleteConfirmation(
                                          department.id
                                        )
                                      }
                                    >
                                      <span className="sr-only">
                                        delete button
                                      </span>
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
                                  <Tooltip title="Go to department" arrow>
                                    <Link
                                      to={`/departments/${
                                        department.id
                                      }?departmentName=${encodeURIComponent(
                                        department.department_name
                                      )}`}
                                      className="flex items-center"
                                    >
                                      <button
                                        className="inline-flex items-center text-[#F29D41] group-hover:text-gray-800 justify-center h-7 w-7 p-1 mr-3 text-sm font-medium bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                        type="button"
                                      >
                                        <PiFolderOpen size={23} />
                                      </button>
                                    </Link>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {departmentList.length > 10 && (
                        <tr>
                        <td className=" py-[11px] px-8 text-sm text-gray-400">
                          Showing {currentPage} to {totalPages} of {departmentList.length}
                        </td>
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
            )}
            <CreateDepartment
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              fetchData={fetchDepartment}
            />
          </div>
          {/* <div className="flex justify-center items-center mt-5 mb-5">
        <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(folderList.length / itemsPerPage)}
        setCurrentPage={setCurrentPage}
      />
      </div> */}
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDelete}
        departmentId={deleteDepartmentId}
      />
      <UpdateConfirmationPopup
        isOpen={isUpdateConfirmationOpen}
        onClose={handleCloseUpdateConfirmation}
        onConfirm={() => {
          handleCloseUpdateConfirmation();
          handleSaveEdit(editDepartmentId);
        }}
      />
    </>
  );
};
