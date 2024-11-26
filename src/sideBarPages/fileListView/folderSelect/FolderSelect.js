import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import Menu from "@mui/material/Menu";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdFolder, MdLabel } from "react-icons/md";
import { Tooltip } from "@material-ui/core";


const FolderSelect = ({
  onSelect,
  file,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDoubleDropdownOpen, setIsDoubleDropdownOpen] = useState(false);
  const [nestedMenuAnchorEl, setNestedMenuAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Selected File:", file);
  }, [file]);
  useEffect(() => {
    setSelectedFile(file);
  }, [file]);
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
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/folder/list/`);
        const data = await response.json();
        const filteredFolderList = data.folder_list.filter(folder => folder.account_id === user.id);
        setFolderList(filteredFolderList);
        console.log(filteredFolderList);
      } catch (error) {
        console.error("Error fetching folder data", error);
      }
    };
    fetchData();
  }, [user]);

  const handleNewfolder = () => {
    navigate("/display-folders");
    setAnchorEl(null);
  };
 
  const handleOptionSelect = async (folder) => {
    try {
      const fileId = selectedFile.pk;
      const formData = new FormData();
      formData.append('folder_id', folder.id);
      await axios.post(`${process.env.REACT_APP_API_URL}/file/update/${fileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedOption(folder.name);
      window.location.reload();
      setIsDropdownOpen(false);
      onSelect(folder.id);
      console.log('Selected folder:', folder);
      setIsDoubleDropdownOpen(false);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error updating file with folder', error);
    }
  };
  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowAllFolders = (event) => {
    setNestedMenuAnchorEl(event.currentTarget);
  };
  const handleCloseNestedMenu = () => {
    setNestedMenuAnchorEl(null);
  };
  const handleEditFolder = () => {
    navigate("/add-subfolder/:folderId");
    setAnchorEl(null);
  };


  return (
    <>
      <Container style={{ display: "flex", }}>
        <div>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <Tooltip title="add to folder" arrow>
                <button
                {...bindTrigger(popupState)}
                onClick={handleButtonClick}

                  className="text-red"
                >
                  <MdFolder size={23} />
                </button>
              </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {folderList.length === 0 ? (
                    <>
                      <MenuItem onClick={handleNewfolder}>Create & edit folder</MenuItem>
                      <MenuItem disabled>No folders found</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={handleNewfolder}>
                        Create and edit folders
                      </MenuItem>
                      <MenuItem onClick={handleShowAllFolders}>
                        Show all folders
                      </MenuItem>
                      {isDoubleDropdownOpen && (
                        <Menu>
                          {folderList.map((folder) => (
                            <MenuItem
                              key={folder.id}
                              onClick={() => handleOptionSelect(folder)}
                              style={{ color: "black" }}
                            >
                              {folder.name}
                            </MenuItem>
                          ))}
                        </Menu>
                      )}
                    </>
                  )}
                </Menu>
                <Menu
                  anchorEl={nestedMenuAnchorEl}
                  open={Boolean(nestedMenuAnchorEl)}
                  onClose={handleCloseNestedMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {folderList.map((folder) => (
                    <MenuItem
                      key={folder.id}
                      onClick={() => handleOptionSelect(folder)}
                      style={{ color: "black" }}
                    >
                      {folder.name}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </PopupState>
        </div>
       
      </Container>
    </>
  );
};
export default FolderSelect;