import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../actions/auth";
import axios from "axios";
import Header from "../pages/Home/components/Header";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from "sonner";
import "../../src/containers/Signup.css"
import CircularProgress from '@mui/material/CircularProgress';
import signuplogo from "../../src/images/logo.svg"
import group from "../../src/images/Group.png"

const Signup = ({ signup, isAuthenticated, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordPatternError, setPasswordPatternError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [emailFormatError, setEmailFormatError] = useState('');


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const navigate = useNavigate();
  const { first_name, last_name, email, password, re_password } = formData;
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);

  const onChange = (e) => {
    console.log("Changing:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setEmailExists(false);

    switch (e.target.name) {
      case "first_name":
        console.log("Setting first name error");
        setFirstNameError(e.target.value ? '' : 'Please enter First Name.');
        break;

      case "last_name":
        console.log("Setting last name error");
        setLastNameError(e.target.value ? '' : 'Please enter Last Name.');
        break;


      case "password":
        if (!e.target.value) {
          setPasswordMatchError("Please enter Password.");
        } else if (formData.re_password && e.target.value !== formData.re_password) {
          setPasswordMatchError("Password and Confirm Password do not match.");
        } else {
          setPasswordMatchError('');
        }


        const passwordPattern = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&?])(?!.*[;]).{8,32})/;
        if (!passwordPattern.test(e.target.value)) {
          setPasswordPatternError("Password must have at least one digit, one lowercase letter, one uppercase letter, one special character, and be 8-32 characters long.");
        } else {
          setPasswordPatternError('');
        }
        break;

      case "re_password":
        if (!e.target.value) {
          setPasswordMatchError("Please enter Confirm Password.");
        } else if (formData.password && e.target.value !== formData.password) {
          setPasswordMatchError("Password and Confirm Password do not match.");
        } else {
          setPasswordMatchError('');
        }
        break;
      case "email":
        if (!e.target.value) {
          setEmailFormatError('Please enter Email.');
        } else if (!/\S+@\S+\.\S+/.test(e.target.value)) {
          setEmailFormatError('Invalid email format.');
        } else {
          setEmailFormatError('');
        }
        break;
      default:
        break;
    }
  };



  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/file/check-email/?email=${email}`,
        { params: { email } }
      );

      console.log('Response from checkEmailExists:', response.data);
      return response.data;
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  };


  const handleBlur = async () => {
    try {
      const currentEmail = email;

      if (currentEmail) {
        const response = await checkEmailExists(currentEmail);

        console.log('Email check response in handleBlur:', response);

        if (response === 'Email exists') {
          const errorMessage = 'Email already exists. Please use a different email.';
          setEmailExists(true);
          setEmailErrorMessage(errorMessage);
          // toast.error(errorMessage);
        } else {
          setEmailExists(false);
          setEmailErrorMessage(null);
        }
      }
    } catch (error) {
      console.error('Email validation error in handleBlur:', error.message);
      setEmailExists(false);
      setEmailErrorMessage('Failed to validate email.');
    }
  };



  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let hasError = false;
    if (!first_name) {
      setFirstNameError('Please enter First Name.');
      hasError = true;
    } else {
      setFirstNameError('');
    }

    if (!last_name) {
      setLastNameError('Please enter Last Name.');
      hasError = true;
    } else {
      setLastNameError('');
    }

    if (!email) {
      setEmailFormatError('Please enter Email.');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailFormatError('Invalid email format.');
      hasError = true;
    } else {
      setEmailFormatError('');
    }

    const passwordPattern = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&?])(?!.*[;]))/;
    if (!password) {
      setPasswordPatternError('Please enter Password.');
      hasError = true;
    } else if (!passwordPattern.test(password)) {
      setPasswordPatternError("Password should contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be 8-32 characters long.");
      hasError = true;
    } else {
      setPasswordPatternError('');
    }

    if (!re_password) {
      setPasswordMatchError('Please enter Confirm Password.');
      hasError = true;
    } else if (password !== re_password) {
      setPasswordMatchError('Password and Confirm Password do not match.');
      hasError = true;
    } else {
      setPasswordMatchError('');
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      if (password === first_name || password === last_name || re_password === first_name || re_password === last_name) {
        const errorMessage = 'Password and confirm password cannot be the same as first name or last name.';
        toast.error(errorMessage);
        console.error('Signup Error:', errorMessage);
        setLoading(false);
        return;
      }

      const signupSuccess = await signup(first_name, last_name, email, password, re_password);

      if (signupSuccess) {
        navigate('/login');
      } else {
        throw new Error('An error occurred during signup.');
      }
    } catch (error) {
      console.error('Signup Error:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };




  const continueWithGoogle = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`
      );
      window.location.replace(res.data.authorization_url);
    } catch (err) { }
  };
  if (isAuthenticated) {
    return <Link to="/" />;
  }
  if (accountCreated) {
    return <Link to="/login" />;
  }
  return (
    <>
      {/* <Header /> */}
      <div className="sign-up-main  grid grid-cols-2 ">
        <div class="  px-8 py-8 lg:px-8">
      
          <div className="signup-img-main mb-2 ">

            <img src={signuplogo} alt="" />
          </div>
          <div class="signup-form mt-4">

            <form onSubmit={(e) => onSubmit(e)} className="mb-1">
              <div class="sm:mx-auto sm:w-full sm:max-w-sm" 
              >
                <h2 class="signup-heading mt-2 mb-2 text-center leading-9  text-sky-900 ">
                  Sign Up
                </h2>
                <h1 className="signup-main-heading text-center mb-4">
                  Please enter your login information
                </h1>
              </div>
              <div className="flex gap-3">
                <div className="mb-2">
                  <label
                    htmlFor="firstname"
                    className="block text-md  leading-6 text-gray-900"
                  >
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
                      type="text"
                      placeholder="First Name"
                      name="first_name"
                      value={first_name}
                      onChange={(e) => onChange(e)}

                    />
                    {firstNameError && (
                      <p style={{ color: 'red' }}>{firstNameError}</p>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="last_name"
                    className="block text-md leading-6 text-gray-900">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
                      type="text"
                      placeholder="Last Name"
                      name="last_name"
                      value={last_name}
                      onChange={(e) => onChange(e)}
                    />
                    {lastNameError && (
                      <p style={{ color: 'red' }}>{lastNameError}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-md leading-6 text-gray-900 "
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    className={`border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none ${emailExists || emailFormatError ? 'border-red-500' : ''
                      }`}
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                    onBlur={handleBlur}
                  />
                  {emailFormatError && (
                    <p style={{ color: 'red' }}>{emailFormatError}</p>
                  )}
                  {emailExists && (
                    <p style={{ color: 'red' }}>{emailErrorMessage}</p>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label
                  for="password"
                  class="block text-md text-gray-900 leading-6 "
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input

                    type={showPassword ? "text" : "password"}
                    className="border-2 border-gray-200 p-2 pr-10 rounded-md w-full focus:border-sky-700 focus:outline-none"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                  // onBlur={handlePasswordBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-sky-700 hover:text-sky-800 focus:outline-none"
                  >
                    {showPassword ? (
                      <VisibilityIcon style={{ fontSize: '24px' }} />
                    ) : (
                      <VisibilityOffIcon style={{ fontSize: '24px' }} />
                    )}
                  </button>
                </div>
                {passwordPatternError && (
                  <p style={{ color: 'red' }}>{passwordPatternError}</p>
                )}
              </div>
              <div className="mb-2">
                <label
                  for="confirm_Password"
                  class="block text-md  leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input

                    type={showConfirmPassword ? "text" : "password"}
                    className="border-2 border-gray-200 p-2 pr-10 rounded-md w-full focus:border-sky-700 focus:outline-none " 
                    placeholder="Confirm Password"
                    name="re_password"
                    value={re_password}
                    // onBlur={handlePasswordBlur}

                    onChange={(e) => onChange(e)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-sky-700 hover:text-sky-800 focus:outline-none"
                  
                  >
                    {showConfirmPassword ? (
                      <VisibilityIcon style={{ fontSize: '24px' }} />
                    ) : (
                      <VisibilityOffIcon style={{ fontSize: '24px' }} />
                    )}
                  </button>
                </div>
                {passwordMatchError && (
                  <p style={{ color: 'red' }}>{passwordMatchError}</p>
                )}
              </div>
              <button
                type="submit"
                class="text-white focus:ring-4 w-full focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-body"
                style={{ backgroundColor: "#6254B6" }}
                >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign Up'}
              </button>
              <div className="flex flex-col items-center ">
                <p className="text-center mt-0.5">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className=" text-sky-900 hover:text-sky-500"
                    style={{ color: "#6254B6" }}
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        
        </div>
        <div className="docvault-signup">
            <img className="docimg" src={group} alt="" />

          </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error
});
export default connect(mapStateToProps, { signup })(Signup);