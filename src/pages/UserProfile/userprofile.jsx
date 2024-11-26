import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { CloudUpload, Clear, TwentyOneMpOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../actions/auth";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../UserProfile/Userprofile.css"
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400.css";
import backgroundpuple from "../../images/image9.png"

import HomeNav from "../../Navbar/homeNav/HomeNav";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#EBF6FF",
    // minHeight: "100vh",
    display: "flex",
    fontFamily:"poppins",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    height: "auto",
    top:"0%",
    fontFamily:"poppins",

    position:"relative",

    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.1)",
  },
  leftSection: {
    flex: "1",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  profileHeader: {
    fontSize: "25px",
    marginBottom: "10px",
  },
  imageContainer: {
    width: "150px",
    height: "12px",
    borderRadius: "50%",
    overflow: "hidden",
    marginBottom: "20px",
    border: "2px solid black",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
  },
  uploadButton: {
    marginTop: "10px",
    backgroundColor: "transparent",
    border: "1px solid #fff",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },

  clearButton: {
    marginTop: "10px",
    backgroundColor: "transparent",
    border: "1px solid black",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },

  uploadClearRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  rightSection: {
    flex: "1",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  form: {
    borderRadius: "10px",
    fontFamily:"poppins",

    padding: "40px",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  inputLabel: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "black",
  },
  inputField: {
    width: "100%",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameField: {
    width: "48%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "3px",
    gap:"6px",
    paddingBottom:"20px"
  },
  // cancelButton: {
  //   marginRight: "10px",
  //   color: "black",
  //   border: "1px solid black",
  //   backgroundColor: "black",
  //   "&:hover": {
  //     backgroundColor: "rgba(78, 121, 245, 0.2)",
  //   },
  // },
  // saveButton: {
  //   background: "#6254B6",
  //   color: "#fff",
  //   "&:hover": {
  //     backgroundColor: "#6254B6",
  //   },
  // },
}));

const ViewProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(updateProfile(user));

    toast.success("Changes saved successfully!");
    window.location.reload();
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUser((prevUser) => ({
            ...prevUser,
            profile_image: reader.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setUser((prevUser) => ({ ...prevUser, profile_image: "" }));
  };

  return (
    
    <div style = {{flex:1}} className={classes.root} >
     
       {/* <HomeNav/> */}
      <ToastContainer position="top-center" />
      <div className={classes.container}>
      <img className="purple-img" src={backgroundpuple} alt="" />
        <div className={classes.leftSection}>
          {/* <Typography variant="h4" className={classes.profileHeader}>
            Profile Section
          </Typography> */}

          {/* <div className={classes.imageContainer}>
            {user.profile_image && (
              <img
                src={user.profile_image}
                alt="Profile"
                className={classes.image}
              />
            )}
          </div>

          <div className={classes.uploadClearRow}>
            <label htmlFor="upload-file" className={classes.uploadButton}>
              {<CloudUpload />} Upload New
            </label>
            <input
              type="file"
              id="upload-file"
              name="profile_image"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <Button
              style={{
                marginTop: "10px",
                backgroundColor: "transparent",
                border: "1px solid #fff",
                padding: "6px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                marginLeft: "15px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={handleClearImage}
              className={classes.clearButton}
              startIcon={<Clear />}
            >
              Clear
            </Button>
          </div> */}

          {/* <label htmlFor="upload-file" className={classes.uploadButton}>
            <CloudUpload />   Upload New
          </label>
          <input type="file" id="upload-file" name="profile_image" onChange={handleImageChange} style={{ display: 'none' }} />
          <Button variant="outlined" onClick={handleClearImage} className={classes.clearButton} startIcon={<Clear />}>
            Clear
          </Button> */}
        </div>
        <div className={classes.rightSection}>
          <div className={classes.form}>
            <div className={classes.inputContainer}>
              <TextField
                label="Email"
                value={user.email}
                className={classes.inputField}
                // onChange={(e) =>
                //   setUser((prevUser) => ({
                //     ...prevUser,
                //     email: e.target.value,
                //   }))
                // }
                disabled
              />
            </div>
            <div className={classes.nameContainer}>
              <div className={classes.nameField}>
                {/* <Typography variant="p" className={classes.inputLabel}>
                  First Name
                </Typography> */}
                <TextField
                  label="First Name"
                  value={user.first_name}
                  className={classes.inputField}
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      first_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={classes.nameField}>
                {/* <Typography variant="p" className={classes.inputLabel}>
                  Last Name
                </Typography> */}
                <TextField
                  label="Last Name"
                  value={user.last_name}
                  className={classes.inputField}
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      last_name: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              onClick={handleCancel}
              style={{
                border: "3px solid ",
                color: "#6254B6",
                width:'12%'

              }}
              className="cancel-button"
              // onClick={() => console.log("Cancel")}
            >
              Cancel
            </Button>
            <Button
            style={{ backgroundColor:"#6254B6"
          }}
              variant="contained"
              onClick={handleSaveChanges}
              className="save-changes"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ViewProfile;