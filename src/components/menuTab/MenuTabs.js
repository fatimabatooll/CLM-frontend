import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import Menu from "@mui/material/Menu";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendDocModal from "../../sideBarPages/sendDoc/SendDoc";
import BackdropOverlay from "../overlay/BackdropOverlay";

const CustomizedMenus = ({
  handleDelete,
  fileId,
  onSelect,
  onOpenDocument,
  onLabelSelect,
  file, // Receive the selectedFile as a prop
}) => {
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDoubleDropdownOpen, setIsDoubleDropdownOpen] = useState(false);
  const [nestedMenuAnchorEl, setNestedMenuAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Moved this line outside the component function
  const [selectedTags, setSelectedTags] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [isSendDocModalOpen, setIsSendDocModalOpen] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    // Log the selectedFile whenever it changes
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
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/file/get_tags/`
        );
        console.log("Fetched Tags:", response.data);

        console.log("Fetched tags:", response.data);

        const tagsArray = response.data.tags || [];
        const userId = user.id;

        const filteredTags = tagsArray.filter(tag => tag.account === userId)
        const reversedTags = filteredTags.slice().reverse();

        setTags(reversedTags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };

    fetchTags();
  }, [user.id]);


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

  const toggleDoubleDropdown = () => {
    setIsDoubleDropdownOpen(!isDoubleDropdownOpen);
  };
  const handleNewfolder = () => {
    navigate("/display-folders");
    setAnchorEl(null);
  };
  const handlecreatetag = () => {
    navigate("/create-label");
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
  const toggleTagInArray = (array, tag) => {
    const tagIndex = array.indexOf(tag);
    if (tagIndex !== -1) {
      return array.filter((item) => item !== tag);
    } else {
      return [...array, tag];
    }
  };
  const handleLabelSelect = async (label) => {
    try {
      if (!selectedFile || !selectedFile.pk) {
        console.error("No selected file or file ID. Aborting tag update.");
        return;
      }
      const fileId = selectedFile.pk;
      const formData = new FormData();
      formData.append("new_tag", label);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/file/update/${fileId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFileList((prevFileList) =>
        prevFileList.map((file) =>
          file.pk === fileId
            ? {
              ...file,
              fields: {
                ...file.fields,
                tags: toggleTagInArray(file.fields.tags, label),
              },
            }
            : file
        )
      );
      setForceRender((prev) => !prev);
      window.location.reload();
    } catch (error) {
      console.error("Error adding tag to file", error);
    }
  };


  const handleShareOrSend = () => {
    if (selectedFile && selectedFile.pk) {
      const fileUrl = selectedFile.fields.download_url;
      const fileName = selectedFile.fields.name;
      const fileId = selectedFile.pk;

      console.log('File URL:', fileUrl);
      console.log('File ID:', fileId);
      console.log("Selected File:", selectedFile);

      if (fileUrl && fileId) {
        setIsSendDocModalOpen(true); 
      } else {
        console.error('Invalid file information for the selected file.');
      }
    } else {
      console.error('No valid file information for the selected file.');
    }

    setAnchorEl(null);
  };






  return (
    <>
      <Container style={{ display: "flex", marginTop: "2rem" }}>
      <div >
          <PopupState variant="popover" popupId="demo-popup-menu-1">
            {(popupState) => (
              <React.Fragment>
                <Button 
                
                  // variant="contained"
                  {...bindTrigger(popupState)}
                  sx={{
                    borderRadius: "5px 0px 0px 5px",
                    color: "black",
                    border: "1px solid black",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#AC94FA", color: "black" },
                  }}
                  onClick={() => {
                    onOpenDocument();
                    popupState.close();
                  }}>
                  Open
                </Button>
              </React.Fragment>
            )}
          </PopupState>
        </div>
        <div>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  {...bindTrigger(popupState)}
                  sx={{
                    borderRadius: "0px 0px 0px 0px",
                    color: "black",
                    border: "1px solid black",
                    backgroundColor: "white",
                   
                      "&:hover": { backgroundColor: "#AC94FA", color: "black" },
                    
                  }}>
                  Actions
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={handleShareOrSend}>Share or Send</MenuItem>
                  {/* <MenuItem onClick={popupState.close}>
                    Download / Export
                  </MenuItem> */}
                  <MenuItem onClick={() => handleDelete(fileId)}>
                    Remove
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
        <div>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  onClick={handleButtonClick}
                  sx={{
                    borderRadius: "0px 0px 0px 0px",
                    color: "black",
                    border: "1px solid black",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#AC94FA", color: "black" },
                  }}
                >
                  Folder
                </Button>
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
              </React.Fragment>
            )}
          </PopupState>

        </div>
        <div>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  {...bindTrigger(popupState)}
                  sx={{
                    borderRadius: "0px 5px 5px 0px",
                    color: "black",
                    backgroundColor: isActive ? "#AC94FA" : "white",
                    border: "1px solid black",
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#AC94FA", color: "black" },
                  }}
                  // onClick={() => setIsActive(!isActive)}
                  >
                  Labels
                </Button>
                <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={handlecreatetag}>
                  Create & edit labels
                </MenuItem>
                <Menu {...bindMenu(popupState)}>
                  {tags.length === 0 ? (
                   <>
                   <MenuItem onClick={handlecreatetag}>Create & edit labels</MenuItem>
                   <MenuItem disabled>No Labels found</MenuItem>
</>

                  ) : (
                    <>
                      <MenuItem onClick={handlecreatetag}>Create & edit labels</MenuItem>
                      {tags.map((tag) => (
                        <MenuItem
                          key={tag.id}
                          onClick={() => {
                            handleLabelSelect(tag.name);
                            popupState.close();
                          }}>
                          {tag.name}
                        </MenuItem>
                      ))}
                    </>
                  )}
                </Menu>

              </Menu>
              </React.Fragment>
            )}
          </PopupState>

          {isSendDocModalOpen && (
            <>
              <BackdropOverlay />
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: "1000",
                  width: "80%",
                  height: "60%",
                }}>
                <SendDocModal

                  onClose={() => setIsSendDocModalOpen(false)}
                  file={selectedFile}

                />
              </div>
            </>

          )}
        </div>
      </Container>
    </>
  );
};
export default CustomizedMenus;