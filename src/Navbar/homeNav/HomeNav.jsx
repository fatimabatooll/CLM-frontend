import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { FaBell, FaAngleDown } from "react-icons/fa";
import pics from "./../../images/download.png";
import { useEffect, useState } from "react";
import { Image } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import "../homeNav/Homenav.css";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/400.css";
import usericon from "../../images/user.png";
import arrow from "../../images/arrow-down.jpg";
import PageContext from "../../pages/PrivateRoute/ContextApi/CreateContext";
import { useLocation } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const useStyles = makeStyles((theme) => ({

}));
function HomeNav() {
  const img =
    "https://cdn.production.dochub.com/assets/img/logo/wordmark-v2-93b801ca7bef5ba79595ffd512209088.svg";
  const img2 =
    "https://cdn.production.dochub.com/assets/img/logo/wordmark-v2-93b801ca7bef5ba79595ffd512209088.svg";
  const classes = useStyles();
  const [user, setuser] = useState({});
  // const { currentPage } = useContext(PageContext);
  const location = useLocation();
  const path = location.pathname;
  let currentPage = "";

  switch (path) {
    case "/dashboard":
      currentPage = "Dashboard";
      break;
    case "/create-label":
      currentPage = "Labels";
      break;
    case "/folders":
      currentPage = "Folders/Labels";
      break;
    case "/inboxed":
      currentPage = "Inbox";
      break;
    case "/receive-doc":
      currentPage = "Sent";
      break;
    case "/signed-doc":
      currentPage = "Signed Documents";
      break;
    case "/file-list":
      currentPage = "Documents";
      break;
    case "/departments":
      currentPage = "Departments Hierarchy";
      break;

    case "/outlook-emails":
      currentPage = "Outlook Emails";
      break;
    case "/Userprofile":
      currentPage = "Profile Information";
      break;
    case "/add-subfolder":
      currentPage = "Subfolders";
    case "/ask-me":
      currentPage = "Document Searching Bot";
      break;
    default:
      currentPage = "";
  }

  const queryParams = new URLSearchParams(location.search);
  const folderName = queryParams.get("folderName");
  const subfolderName = queryParams.get("subfolderName");

  // Append folderName and subfolderName to currentPage if available
  if (folderName) {
    currentPage += ` ${folderName}`;
    if (subfolderName) {
      currentPage += ` /${subfolderName}`;
    }
  }

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    console.log("agyaa", obj);
    if (obj) {
      setuser(obj);
    }
  }, []);
  return (
    <div className=' fixedHomeNav grid grid-cols-2'>

      <div className=' main-heading'>
        <h1 className="main-heading">{currentPage}</h1>
      </div>
      <div className='flex justify-end gap-3 px-4'>
        <div className='usericon'>
          <Link to="/UserProfile" style={{ textDecoration: 'none' }}>
            <AccountCircleIcon style={{ marginTop: '9px', color: '#6254B6', marginLeft: '16px', fontSize: '45px' }} />
          </Link>
        </div>

        <div className="menuItem mt-3">
          <h1 variant="body2" className='username ' >
            {`${user.first_name} ${user.last_name}`}

          </h1>
          <h1 className='mt-1 admin '>
            Admin
          </h1>
        </div>

      </div>
      {/*   <FaBell className={classes.bellIcon} /> Bell icon */}


    </div>

  );
}
export default HomeNav;