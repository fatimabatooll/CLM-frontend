import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { FaFileSignature } from "react-icons/fa";
import { SiHomebridge } from "react-icons/si";
import { FaArrowRightLong, FaHouseChimney } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdEditDocument } from "react-icons/md";
import { ListItemIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TbDiscount } from "react-icons/tb";
import { TbShoppingBagExclamation } from "react-icons/tb";
import { TbShoppingBagCheck } from "react-icons/tb";
import "../../sideBarPages/dashoard/Dashboard.css";
import { CChart } from "@coreui/react-chartjs";
import { firestore } from "../../firestore/firestore";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Bars3BottomLeftIcon,
  BellIcon,
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#EBF6FF",
  },
  icon: {
    fontSize: "35px",
    color: "gray",
    marginLeft: "5px",
    marginTop: "10px",
  },
  icons: {
    fontSize: "35px",
    color: "gray",
    marginLeft: "10px",
    marginTop: "10px",
  },
  arrow: {
    fontSize: "30px",
    color: "gray",
    marginLeft: "260px",
    marginTop: "10px",
  },
  arrow2: {
    fontSize: "30px",
    color: "gray",
    marginLeft: "270px",
    marginTop: "10px",
  },
  homeicon: {
    fontSize: "100px",
    color: "blue",
    marginLeft: "230px",
    marginTop: "100px",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    marginLeft: "20px",
    alignItems: "center",
  },
  formContainer: {
    marginRight: "25%",
  },
  form: {
    width: "120%",
    padding: "20px",
    marginLeft: "80px",
    marginRight: "180px",
  },
  inputContainer: {
    marginLeft: "28%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "-30px",
      width: "auto",
    },
  },
  inputLabel: {
    fontSize: "20px",
    marginLeft: "25%",
    marginBottom: "20px",
    marginTop: "40px",
    color: "black",
    [theme.breakpoints.down("md")]: {
      width: "auto",
    },
  },
  nameContainer: {
    marginTop: "0px",
    marginLeft: "15%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
    },
  },
  nameLabel: {
    fontSize: "20px",
    color: "black",
  },
  newdocumenticon: {
    fontSize: "35px",
    color: "gray",
    marginLeft: "5px",
    marginTop: "10px",
  },
  [theme.breakpoints.down("md")]: {
    form: {
      width: "100%",
      marginLeft: "0",
      marginRight: "0",
    },
    inputContainer: {
      marginLeft: "0",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    nameContainer: {
      marginLeft: "0",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
}));

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [signedDocumentsCount, setSignedDocumentsCount] = useState(0);
  const [unsignedDocumentsCount, setUnsignedDocumentsCount] = useState(0);
  const [SignedDocuments, setSignedDocuments] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [ monthLabel, setLabelMonth] = useState(0);
  const [ monthData, setMonthData] = useState(0);

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    if (
      obj &&
      (obj.first_name !== user.first_name || obj.last_name !== user.last_name)
    ) {
      setUser(obj);
    }
  }, [user]);

  console.log(user);

useEffect(() => {
  const fetchDocumentCounts = async () => {
    try {
      // Check if user.id is available
      if (user.id) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/file/count-documents/?account_id=${user.id}`
        );
        const data = await response.json();
        console.log(data);
        setTotalDocuments(data.total_documents);
        setLabelMonth(data.labels);
        setMonthData(data.data);


        console.log(totalDocuments);
      }
    } catch (error) {
      console.error("Error fetching document counts:", error);
    }
  };

  fetchDocumentCounts();
}, [user.id]); // Add user.id as a dependency

  useEffect(() => {
    const fetchReceivedDocs = async () => {
      if (user.email) {
        const q = query(collection(firestore, "sendData"));
        try {
          const querySnapshot = await getDocs(q);
          const docsData = querySnapshot.docs.map((doc) => ({ ...doc.data() }));

          // Filter documents where the user's email exists in addUserEmails
          let matchingDocs = docsData.filter((doc) => {
            const addUserEmails = doc.addUserEmails || [];
            return addUserEmails.some((obj) => obj.email === user.email);
          });

          let approvedCount = 0;
          let pendingCount = 0;
          let signedCount = 0;
          matchingDocs.forEach((doc) => {
            const { addUserEmails } = doc;
            const recipient = addUserEmails.find(
              (obj) => obj.email === user.email
            );

            if (recipient && recipient.status === "Approved") {
              approvedCount++;
            } else if(recipient && recipient.status === "Pending"){
              pendingCount++;
            }
            else if(recipient && recipient.status === "Signed"){
              signedCount++;
            }
          });

          // Update state variables with counts
          setSignedDocumentsCount(approvedCount);
          setUnsignedDocumentsCount(pendingCount);
          setSignedDocuments(signedCount);

          console.log("Approved Documents:", approvedCount);
          console.log("Pending Documents:", pendingCount);
          console.log("Signed Documents:", signedCount);

        } catch (error) {
          console.error("Error fetching received documents:", error);
        } finally {
        }
      }
    };
    fetchReceivedDocs();
  }, [user.email]);

  const stats = [
    {
      id: 1,
      name: "Total Documents",
      stat: totalDocuments,
      icon: TbDiscount,
      changeType: "increase",
    },
    {
      id: 2,
      name: "Pending",
      stat: unsignedDocumentsCount,
      icon: TbShoppingBagExclamation,
      changeType: "increase",
    },
    {
      id: 3,
      name: "Approved & Signed Documents",
      stat: signedDocumentsCount + SignedDocuments,
      icon: TbShoppingBagCheck,
      changeType: "increase",
    },
    // {
    //   id: 3,
    //   name: "Approval",
    //   stat: [SignedDocuments],
    //   icon: TbShoppingBagCheck,
    //   changeType: "increase",
    // },
  ];

  const handledoc = () => {
    navigate("/upload");
  };
  const handlefolder = () => {
    navigate("/display-folders");
  };
  const handletag = () => {
    navigate("/create-tag");
  };
  return (
    <div style={{ flex: 1 }} className={classes.root}>
      <div className="relative isolate overflow-hidden  py-18 sm:py-24 lg:py-4 w-100  ">
        <div class="mx-auto max-w-17xl px-6 lg:px-8">
          <div>
            <dl className=" grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
  <div
    key={item.id}
    className="relative overflow-hidden rounded-3xl bg-white px-4 pt-4 pb-12 shadow sm:px-6 sm:pt-6"
  >
    <dt>
      <div className="cards-icon w-16 rounded-lg p-3">
        <item.icon
          className="h-8 w-8 text-white"
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="icon-name ml-1 mt-6">{item.name}</p>
      </div>
    </dt>

    <dd className="ml-1 mt-2 flex items-baseline pb-6 sm:pb-7">
      <p className="icon-stats font-semibold">{item.stat}</p>
      <p
        className={classNames(
          item.changeType === "increase"
            ? "text-green-600"
            : "text-red-600",
          "ml-2 flex items-baseline text-sm font-semibold"
        )}
      >
        <span className="sr-only">
          {item.changeType === "increase"
            ? "Increased"
            : "Decreased"} by{" "}
        </span>
        {item.change}
      </p>
      <div className="view-all absolute inset-x-0 bottom-0 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-white hover:text-indigo-500"
            onClick={() => {
              switch(item.name) {
                case "Total Documents":
                  navigate("/file-list");
                  break;
                case "Pending":
                  navigate("/inboxed");
                  break;
                case "Approved & Signed Documents":
                  navigate("/inboxed");
                  break;
                default:
                  break;
              }
            }}
          >
            <p>View all</p>
            <span className="sr-only">{item.name} stats</span>
          </a>
        </div>
      </div>
    </dd>
  </div>
))}


            </dl>
          </div>
        </div>
        <div className="Charts ml-8 grid grid-cols-2   ">
        <div className='line-chart '>
            <CChart className="bar-chart  "
              type="bar"
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', ],
                datasets: [
                  {
                    backgroundColor: '#6254B6',
                    data: monthData,
                    label: ['Documents']

                  },
                ],
                
              }}
              labels="months"
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: ('--cui-body-color'),
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: ('#fff'),
                    },
                    ticks: {
                      color: ('--cui-body-color'),
                    },
                  },
                  y: {
                    grid: {
                      color: ('#fff'),
                    },
                    ticks: {
                      color: ('--cui-body-color'),
                    },
                    min: 0, // Set the minimum value of the y-axis
                    max: 10,
                  },
                },
              }}
            />

          </div>

          <div className="pie-chart ml-8 ">
        <CChart className="piechart "
  type="pie"
  data={{
    
    labels: ['Pending', 'Approved','Signed'],
    datasets: [
      {
        data: [unsignedDocumentsCount,signedDocumentsCount, SignedDocuments],
        backgroundColor: ['#29AAC5', '#7F71D4', '#bf8eed'],
      },
    ],
  }}
  options={{
    // plugins: {
    //   legend: {
    //     labels: {
    //       color: ('--cui-body-color'),
    //     }
    //   }
    // },
    // scales: {
    //   r: {
    //     grid: {
    //       color:('--cui-border-color'),
    //     },
    //   }
    // }
  }}
/>       
            </div>
        </div>

      </div>

    </div>

  );
};
export default Dashboard;