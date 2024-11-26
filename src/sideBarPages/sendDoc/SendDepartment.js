import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../../firestore/firestore";
import { addDoc, collection, Timestamp, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import "./sendDep.css";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import {
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import "./styles.css";
import axios from "axios";
import emailjs from "emailjs-com";
import { toast } from "sonner";
import cuid from "cuid";
import {
  getStorage,
  ref as Storage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
const SendDepartment = ({ file }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileUrl = file?.fields?.download_url;
  const fileName = file?.fields?.name;
  const fileId = file?.pk;
  const documentId = file?.fields?.document_id;
  const [emailLines, setEmailLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [postData, setPostData] = useState("");
  const [EmailList, setEmailList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoadingDep, setIsLoadingDep] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");

  const EMAILJS_USER_ID = "qw4I1NBEsOmRb3kZT";
  const EMAILJS_SERVICE_ID = "service_jjzd7dn";
  const EMAILJS_TEMPLATE_ID = "template_rz0q7sp";
  emailjs.init(EMAILJS_USER_ID);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmail = (emailObj) => {
    const templateParams = {
      to_email: emailObj,
      from_name: user.first_name,
      from_email: user.email,
    };
    console.log(templateParams);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
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
  const handleAddUser = (emailObj) => {
    console.log(emailObj, "emailObj");
    if (emailObj) {
      setUsers([...users, emailObj]);
      setUserPermissions([
        ...userPermissions,
        { email: emailObj, permission: "read" },
      ]);
      setNewUser("");
    }
  };

  const fetchDepartment = async () => {
    setIsLoadingDep(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/departments/list_departments/`,
        {
          withCredentials: true,
        }
      );
      const userId = user.id;

      const departmentsArray = response.data.departments || [];
      const filteredDepartments = departmentsArray.filter(
        (departments) => departments.account_id === userId
      );
      console.log("Filtered departments:", filteredDepartments);

      setDepartments(filteredDepartments);
    } catch (error) {
      console.error("Error fetching departments", error);
    } finally {
      setIsLoadingDep(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [user]);

  useEffect(() => {
    if (!selectedDepartment) return;

    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const employeesList = await axios.get(
          `${process.env.REACT_APP_API_URL}/departments/list_employeesDep/?department_id=${selectedDepartment}&user_id=${user.id}`
        );
    
        const allEmployees = employeesList.data;
        console.log("API Response:", allEmployees);
    
        const userId = user.id;
        console.log("User ID: ", user.id);
        console.log("Selected Department: ", selectedDepartment);
    
        const filteredEmployees = allEmployees.filter(
          (employee) =>
            Number(employee.account_id) === Number(user.id) &&
            Number(employee.department_id) === Number(selectedDepartment)
        );
        const sortedEmployees = filteredEmployees.sort((a, b) => a.order - b.order);
    
        console.log("Filtered employees: ", sortedEmployees);
        setEmployees(sortedEmployees);
    
        // Fetch department name
        if (sortedEmployees.length > 0) {
          const department = departments.find(dept => dept.id === sortedEmployees[0].department_id);
          if (department) {
            console.log("Department Name:", department.department_name);
            setDepartmentName(department.department_name);

            // Do something with the department name
          } else {
            console.log("Department not found.");
          }
        } else {
          console.log("No employees found for the selected department.");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchEmployees();
  }, [selectedDepartment, user.id]);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const DepartmentSend = async () => {
    console.log(employees);

    if (employees.length === 0) {
      setErrorMessage("Please fetch the list of users before sending.");
      return;
    }
    if (!fileUrl) {
      setErrorMessage("Please provide a valid file URL.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const tokenNumber = uuidv4();
      const storage = getStorage();
      const storageRef = Storage(storage, `sendData/${uniqueFileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const recipients = employees.map(({ email, name }) => ({
        id: cuid(),
        email,
        name,
      }));
      const postData = {
        recipientIds: recipients.map((recipient) => recipient.id),
        recipients: recipients,
        file: {
          fileName: file.name,
          downloadURL: downloadURL,
          timestamp: Timestamp.fromDate(new Date()),
          account: user.id,
        },
      };
      setPostData(postData);
      const url = downloadURL.split("googleapis.com")[1];
      const encodedURL = encodeURIComponent(url);
      const firstRecipient = recipients[0];

     const sentTime = new Date().toISOString();
      const date = new Date(sentTime);
      const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "UTC",
        timeZoneName: "short",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);
      const firebaseData = {
        senderemail: user.email,
        addUserEmails: recipients.map((r, index) => ({
          ...r,
          status: index === 0 ? "Pending" : "Not Sent",
          sentTime: index === 0 ? formattedDate : null,
        })),
        requestedTime: serverTimestamp(),
        uid: user.id,
        fileId: fileId,
        fileUrl,
        fileName,
        owner: `${user.first_name} ${user.last_name}`,
        tokenNumber: tokenNumber,
        department_hierarchy: departmentName
      };
      const docRef = await addDoc(
        collection(firestore, "sendData"),
        firebaseData
      );
      console.log("Firestore document added with ID: ", docRef.id);
      sendEmail(firstRecipient.email);
      toast.success("File sent successfully!");
      const stateData = {
        postData: postData,
        doc: encodedURL,
        file: file,
      };
      navigate("/inboxed");
      toast.success("File sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error sending document.");
    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
          <div
            role="status"
            class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
          <div className="w-full p-4 bg-white border border-gray-200  sm:p-8 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col">
              <button className="text-black focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-md shadow-purple-200/50 border-1 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body">
                Sharing file: {fileName}
              </button>

              <div>
              <div className="pt-3 pb-2">
                <select
                  id="filter-option-select"
                  className={`${selectedDepartment ? 'text-gray-700 border-gray-300  focus:outline-none': 'border border-gray-200 text-gray-500 focus:outline-none' } `}
                  value={selectedDepartment || ""}
                  onChange={handleDepartmentChange}
                  style={{
                    width: "100%",
                    padding: " 8px",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                    borderWidth: "1px",
                  }}
                >
                  <option value="" className={`py-2.5  ${selectedDepartment && 'text-gray-600 '} focus:outline-none`}>Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
              {isLoading ? (
                <p className="text-gray-500">Loading Departments...</p>
              ) : (
                <div>
                  {employees.length > 0 ? (
                    <ul>
                    {employees.map((emailObj, index) => (
                      <Chip
                        key={index}
                        avatar={<Avatar>{emailObj.name.charAt(0)}</Avatar>}
                        label={emailObj.name}
                        color="primary"
                        variant="outlined"
                        className="mr-2 mt-2 p-2"
                      />
                    ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 mt-2"> No departments found in this hierarchy.</p>
                  )}
                </div>
              )}
            </div>
        


         
              
            </div>
          </div>
          <div className="flex justify-center mt-2">
          <button
          className="text-white  mt-2 mb-2 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center font-body"
          style={{ backgroundColor: "#6254B6" }}
          onClick={DepartmentSend}>
          Send
        </button>
        </div>
          
        
    </>
  );
};
export default SendDepartment;