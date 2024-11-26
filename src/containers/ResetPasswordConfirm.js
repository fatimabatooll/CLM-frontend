import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { reset_password_confirm } from "../actions/auth";
import { useParams } from "react-router-dom";
const ResetPasswordConfirm = ({ reset_password_confirm }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;
  // Use useParams outside of the onSubmit function
  const { uid, token } = useParams();
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    reset_password_confirm(uid, token, new_password, re_new_password);
    setRequestSent(true);
  };
  if (requestSent) {
    return <Link to="/" />;
  }
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-purple-700">
          Reset Password
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={(e) => onSubmit(e)}>
          <div class="mt-2">
            <input
              className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
              type="password"
              placeholder="New Password"
              name="new_password"
              value={new_password}
              onChange={(e) => onChange(e)}
              minLength="6"
              required
            />
          </div>
          <div class="mt-2">
            <input
              className="border-2 border-gray-200 p-2 rounded-md w-full focus:border-sky-700 focus:outline-none"
              type="password"
              placeholder="Confirm New Password"
              name="re_new_password"
              value={re_new_password}
              onChange={(e) => onChange(e)}
              minLength="6"
              required
            />
          </div>
          <button
            class="text-white focus:ring-4 w-full focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 shadow-lg shadow-sky-500/50 dark:shadow-lg dark:shadow-sky-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mb-4 font-body"
            style={{ backgroundColor: "#6254B6" }}
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);