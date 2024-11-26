import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TextField, Box, Tooltip, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import axios from "axios";
import CreateFolder from "./createFolder/CreateFolder";
import DeleteConfirmationPopup from "./alertConfirmations/DeleteConfirmationPopup";
import UpdateConfirmationPopup from "./alertConfirmations/UpdateConfirmationPopup";
import Pagination from "../../components/pagination/Pagination";
import { PiFolderNotchOpen } from "react-icons/pi";

const DisplayFolder = () => {
  const [folderList, setFolderList] = useState([]);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState({});
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(folderList.length / itemsPerPage);

  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;

  const currentFiles = folderList.slice(indexOfFirstFile, indexOfLastFile);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenDeleteConfirmation = (id) => {
    setDeleteFolderId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteFolderId(null);
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

  const fetchFolder = async () => {
    setIsLoadingFolder(true); // Set loading to true while fetching data
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/folder/list/`
      );
      console.log("Fetched folders:", response.data);

      const foldersArray = response.data.folder_list || [];
      const userId = user.id;

      const filteredFolders = foldersArray.filter(
        (folder) => folder.account_id === userId
      );
      // const reversedFolders = filteredFolders.slice().reverse();

      // setFolderList(reversedFolders);
      const sortedFolders = filteredFolders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const reversedFolders = sortedFolders.reverse();

 setFolderList(reversedFolders);
    } catch (error) {
      console.error("Error fetching folders", error);
    } finally {
      setIsLoadingFolder(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchFolder();
  }, [user]); 

  const handleDelete = async (id, isSubfolder = false) => {
    setIsDeleteConfirmationOpen(true);
    console.log(
      `Deleting ${isSubfolder ? "sub-folder" : "folder"} with ID:`,
      id
    );
    const endpoint = isSubfolder
      ? `${process.env.REACT_APP_API_URL}/subfolder/delete/${id}/`
      : `${process.env.REACT_APP_API_URL}/folder/delete/${id}/`;

    try {
      await fetch(endpoint, {
        method: "DELETE",
      });

      // Update the folder list after deletion
      setFolderList((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== id)
      );
    } catch (error) {
      console.error(
        `Error deleting ${isSubfolder ? "sub-folder" : "folder"}`,
        error
      );
    }
  };
  const handleEdit = (id, name) => {
    setEditFolderId(id);
    setEditedFolderName(name);
  };
  const handleCancelEdit = () => {
    setEditFolderId(null);
    setEditedFolderName("");
  };
  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedFolderName);
      await fetch(`${process.env.REACT_APP_API_URL}/folder/edit/${id}/`, {
        method: "POST",
        body: formData,
      });
      setFolderList((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === id ? { ...folder, name: editedFolderName } : folder
        )
      );
      setEditFolderId(null);
      setEditedFolderName("");
      // handleOpenUpdateConfirmation();
    } catch (error) {
      console.error("Error editing folder", error);
    }
  };
  const renderFolderLink = (folder) => (
    <Link
      to={`/add-subfolder/${folder.id}?folderName=${encodeURIComponent(
        folder.name
      )}`}
      className="flex items-center"
    >
      <span className="text-gray-900 dark:text-black text-lg pl-3">
        {editFolderId === folder.id ? (
          <input
            className="border-2 border-gray-500 p-2 rounded-md w-1/2 focus:border-sky-700 focus:outline-none"
            placeholder="folder Name"
            value={editedFolderName}
            onChange={(e) => setEditedFolderName(e.target.value)}
          />
        ) : (
          folder.name
        )}
      </span>
    </Link>
  );

  return (
    <>
      <div
        style={{ backgroundColor: "#EBF6FF", height: "80vh" }}
        className="relative h-screen isolate overflow-hidden py-12 sm:py-8 lg:py-27 w-100 "
      >
        <div class="mx-auto px-6 lg:px-8 ">
          <div className="w-full p-6 bg-white rounded-2xl sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 mt-2">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black font-body">
                Manage Folders
                <p class="mt-0 text-sm leading-8 text-gray-500 font-body">
                  Group documents, sign requests, or templates into folders to
                  organize your content.
                </p>
              </h5>
              <button
                onClick={handleOpenModal}
                type="submit"
                class=" text-white focus:ring-4  focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
              >
                Add New Folder
              </button>
            </div>

            {isLoadingFolder ? ( // Show loading spinner if data is still loading
              <div className="flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : folderList.length === 0 ? ( // Show message if no folders found
              <p className="text-gray-500 dark:text-gray-400">
                No folders found.
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
                        <th scope="col" class="px-8 py-3">
                          Folders
                        </th>
                        <th scope="col" class="px-6 pl-4 pr-3 ">
                          <div className="flex items-center px-8 justify-end">
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFiles.map((folder) => (
                        <tr
                          key={folder.id}
                          className="group hover:bg-gray-100 dark:hover:bg-purple-100  border-b border-gray-200 dark:border-purple-300"
                        >
                          <td className="px-6 py-3   font-body text-gray-900 dark:text-black">
                            {editFolderId === folder.id ? (
                              <input
                                className=" p-2 rounded-md w-1/2 focus:border-purple-700 focus:outline-none"
                                placeholder="folder Name"
                                value={editedFolderName}
                                onChange={(e) =>
                                  setEditedFolderName(e.target.value)
                                }
                              />
                            ) : (
                              renderFolderLink(folder)
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end">
                              {editFolderId === folder.id ? (
                                <>
                                  <Tooltip title="update changes" arrow>
                                    <button
                                      onClick={handleOpenUpdateConfirmation}
                                      className="inline-flex items-center justify-center h-7 w-7 p-1  text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
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
                                      className="inline-flex items-center justify-center h-7 w-7 p-1 text-sm font-medium text-gray-500 bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
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
                                        handleEdit(folder.id, folder.name)
                                      }
                                      className="inline-flex items-center  justify-center h-7 w-7 p-1  text-sm font-medium bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                      type="button"
                                    >
                                      <span className="sr-only">
                                        Edit button
                                      </span>
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
                                        handleOpenDeleteConfirmation(folder.id)
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
                                  <Tooltip title="Go to folder" arrow>
                                    <Link
                                      to={`/add-subfolder/${
                                        folder.id
                                      }?folderName=${encodeURIComponent(
                                        folder.name
                                      )}`}
                                    >
                                      <button
                                        className="inline-flex items-center text-[#F29D41] group-hover:text-gray-800 justify-center h-7 w-7 p-1 mr-3 text-sm font-medium bg-transparent focus:outline-none hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                        type="button"
                                      >
                                        <PiFolderNotchOpen size={23} />
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
                      {folderList.length > 5 && (
                        <tr>
                          <td className=" py-[11px] px-8 text-sm text-gray-400">
                            Showing {currentPage} to {totalPages} of{" "}
                            {folderList.length}
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
            <CreateFolder
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              fetchData={fetchFolder}
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
        folderId={deleteFolderId}
      />
      <UpdateConfirmationPopup
        isOpen={isUpdateConfirmationOpen}
        onClose={handleCloseUpdateConfirmation}
        onConfirm={() => {
          handleCloseUpdateConfirmation();
          handleSaveEdit(editFolderId);
        }}
      />
    </>
  );
};
export default DisplayFolder;