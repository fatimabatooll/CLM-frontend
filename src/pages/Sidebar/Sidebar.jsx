import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400.css";
import "../Sidebar/Sidebar.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
  IconButton,
} from "@material-ui/core";

import { FaGlobeAsia } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { IoCloudDoneOutline } from "react-icons/io5";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { CiLogout } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiHome5Line } from "react-icons/ri";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuFolderClosed } from "react-icons/lu";
import { BsSend } from "react-icons/bs";
import { BiMessageSquareDots, BiSend } from "react-icons/bi";
import DescriptionIcon from "@mui/icons-material/Description";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { logout } from "../../actions/auth";
import logo from "../../images/logo.svg";
const drawerWidth = 312;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    fontFamily: "Poppins",
  },
  drawerPaper: {
    position: "fixed",
    top: 0,
    fontFamily: "Poppins",

    width: drawerWidth,
    // border: "1px solid #ccc",
    // backgroundColor: "#F5F5F5",
    height: "100vh",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  content: {
    padding: theme.spacing(8),
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(1),
  },

  ListItem: {
    borderRadius: "10px",
    marginTop: "4px",
    width: "93%",
    marginLeft: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    fontFamily: "Poppins",
    top: "30px",
    color: "#49535f",
    "&:hover": {
      color: "#6254B6",
    },
  },
  icon: {
    fontSize: "20px",
    color: "#49535f",
    marginTop: "-5px",
    marginLeft: "25px",
  },
  // newdocumentList: {
  //   borderRadius: '10px',
  //   width: '80%',
  //   marginLeft: '20px',
  //   color: '#6254B6',
  //   backgroundColor: '#6254B6',
  //   '&:hover': {
  //     backgroundColor: '#02abe6',
  //     color:'#6254B6'
  //   },
  // },
  // newdocumenticon: {
  //   marginLeft: '15px',
  //   fontSize: '1.4rem',
  //   color: 'white'
  // },
  selected: {
    backgroundColor: "#dee2e3",
    borderRadius: "5px",
    fontFamily: "Poppins",

    color: "#6254B6",
    "& svg": {
      color: "#6254B6",
    },
    "&:hover": {
      backgroundColor: "#E4E1FA",
      color: "#6254B6",
    },
  },
}));

const SideNavbar = ({ logout }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleButtonClick = (buttonName) => {
    console.log("Button clicked:", buttonName);
    setSelectedButton(buttonName);
  };

  const logout_user = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <div>
      <List className="drawer">
        {/* <Link to="/upload" className="rounded-md w-30 h-16">
          <ListItem
            className={`${classes.newdocumentList} ${
              selectedButton === "New Documents"  
            }`}
            button
            onClick={() => handleButtonClick("New Documents")}
          >
            <ListItemIcon>
              <MdAddBox className={classes.newdocumenticon} />
            </ListItemIcon>
            <ListItemText primary="New Documents" />
          </ListItem>
        </Link> */}
        <ListItem className="logo-main">
          <img src={logo} alt="" />
        </ListItem>
        <Link to="/dashboard">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Dashboard" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Dashboard")}
          >
            <ListItemIcon>
              <RiHome5Line className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Dashboard</h1>
          </ListItem>
        </Link>

        <Link to="/departments">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Departments Hierarchy" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Departments Hierarchy")}
          >
            <ListItemIcon>
              <FaPeopleGroup className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Departments Hierarchy</h1>
          </ListItem>
        </Link>

        <Link to="/folders">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Folders" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Folders")}
          >
            <ListItemIcon>
              <LuFolderClosed className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Folders/Labels</h1>
          </ListItem>
        </Link>
        {/* <Link to="/receive-doc">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Sent" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Sent")}
          >
            <ListItemIcon>
              <BsSend className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Sent</h1>
          </ListItem>
        </Link> */}
        <Link to="/file-list">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Documents" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Documents")}
          >
            <ListItemIcon>
              <HiOutlineDocumentText className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">All Documents</h1>
          </ListItem>
        </Link>
        <Link to="/inboxed">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Inbox" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Inbox")}
          >
            <ListItemIcon>
              <HiOutlineInboxArrowDown className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Inbox</h1>
          </ListItem>
        </Link>
        {/* <Link to="/signed-doc">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "signed-doc" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("signedDocuments")}
          >
            <ListItemIcon>
              <IoCloudDoneOutline className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Completed</h1>
          </ListItem>
        </Link> */}
        <Link to="/outlook-emails">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "outlook-emails" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("outlook-emails")}
          >
            <ListItemIcon>
              <MdOutlineMailOutline className={classes.icon} />
            </ListItemIcon>
            <h1 className="list-item">Outlook Emails</h1>
          </ListItem>
        </Link>
      </List>
      {/* <Divider style={{ height: '10px', color: 'gray' }} /> */}
      <></>
      <div className="logout">
        <List>
          <div className="profile-logout">
            <ListItemIcon>
              <IoPersonOutline
                className={classes.icon}
                style={{ marginTop: "2%" }}
              />
            </ListItemIcon>
            <Link to="/Userprofile">
              {" "}
              <span className="profile-text">Profile</span>
              {/* <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Profile" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Profile")}
          >
           */}
              {/* <ListItemText style={{  }} primary="Profile" />
          </ListItem> */}
            </Link>
          </div>
          {/* <Divider style={{ height: '10px', color: 'gray' }} /> */}
          <div className="profile-logout">
            <ListItemIcon>
              <CiLogout className={classes.icon} style={{ marginTop: "10%" }} />{" "}
            </ListItemIcon>
            <button onClick={logout_user}>
              <span className="profile-text">Logout</span>
            </button>
          </div>
        </List>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <Hidden smUp implementation="css">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()), // Map your logout action to props
});

export default connect(null, mapDispatchToProps)(SideNavbar);
