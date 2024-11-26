import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const LabelModal = ({ isOpen, onClose, fetchData }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#0ea5e9");
  const [tags, setTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleTagNameChange = (e) => {
    setTagName(e.target.value);
  };
  const handleTagColorChange = (e) => {
    setTagColor(e.target.value);
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

  const handleAddTag = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("tag_name", tagName);
      formData.append("tag_color", tagColor);
      formData.append("account", user.id);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/file/create_tag/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTagName("");
      setTagColor("#0ea5e9");
      setSelectedColor(tagColor);

      setTags("");
      fetchData();
      onClose();

      toast.success("Tag created successfully");
      navigate("/folders");

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      console.error("Error adding tag:", error);
      console.log("Server response:", error.response?.data);

      // Show error toast here if needed
      toast.error("Error creating tag");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose()
    setTagName('')
    setTagColor("#0ea5e9")
  }

  const handleCreateButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleAddTag();
    }, 2000);
  };
  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/get_tags/`
      );
      console.log("Fetched tags:", response.data);
      setTags(response.data.tags || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };
  useEffect(() => {
    fetchTags();
  }, []);
  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      style={loading ? { minHeight: "150px" } : {}}
      PaperProps={{
        style: {
          borderRadius: "15px",
          width: "900px", // Set the border radius here
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
              Creating label
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
                Create Label
              </h1>
              <button className="px-2" onClick={handleCancel}>
                <IoClose size={25} />
              </button>
            </div>
            <div className="bg-white m-[9px] rounded-2xl p-[10px]">
              <DialogContent>
                <div className="flex items-center space-x-2 text-sm ">
                  <div
                    style={{
                      backgroundColor: tagColor,
                      padding: "12px",
                      borderRadius: "90px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <div
                      className="text-grey"
                      style={{
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tagName || "Label preview"}
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogContent>
                <input
                  id="tagName"
                  className="border-2 border-gray-400 p-[12px] text-start w-full rounded-lg focus:outline-none"
                  placeholder="Label name"
                  value={tagName}
                  onChange={(e) => handleTagNameChange(e)}
                />
              </DialogContent>
              <DialogContent>
                <label
                  htmlFor="tagColor"
                  style={{ color: "#07224D" }}
                  className="block text-base font-medium leading-6 mb-1 text-purple-900"
                >
                  Change Label Color
                </label>
                <div className="flex items-center space-x-2">
                  <div className="rounded inline-flex overflow-hidden">
                    <input
                      type="color"
                      id="tagColor"
                      className="w-5 h-4 appearance-none"
                      style={{ padding: "0", margin: "0", border: "none" }}
                      value={tagColor}
                      onChange={(e) => handleTagColorChange(e)}
                    />
                  </div>
                </div>
              </DialogContent>

              <DialogActions className="">
                <div className="flex justify-center items-center  w-full gap-4">
                  <button
                    type="submit"
                    style={{ border: "1px #6254B6 solid" }}
                    className="text-[#6254B6] focus:ring-4 hover:bg-purple-50 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 font-body"
                    onClick={handleCancel}
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
    </Dialog>
  );
};
export default LabelModal;