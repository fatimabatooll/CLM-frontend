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


const LabelSelect = ({
    fileId,

    file,
}) => {
    const [fileList, setFileList] = useState([]);
    const [tags, setTags] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [forceRender, setForceRender] = useState(false);
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

  
  
    const handlecreatetag = () => {
        navigate("/create-label");
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
    return (
        <>
            <Container style={{ display: "flex", }}>

                <div>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <>
                                <Tooltip title="add-labels" arrow>
                                    <button
                                        {...bindTrigger(popupState)}

                                        className="text-red"
                                    >
                                        <MdLabel size={23} />
                                    </button>
                                </Tooltip>
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
                            </>
                        )}
                    </PopupState>
                </div>
            </Container>
        </>
    );
};
export default LabelSelect;