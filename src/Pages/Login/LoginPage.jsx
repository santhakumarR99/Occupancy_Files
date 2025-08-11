import React from "react";
import { useState, useEffect } from "react";
import "../../Components/Styles/LoginPage.css"; // Import your CSS file
import logoicon from "../../Components/Assets/Occ_icon.png";
import Clogo from "../../Components/Assets/cl2.png";
import firefoxlogo from "../../Components/Assets/Firefoxlogo.svg";
import chromelogo from "../../Components/Assets/chromelogo.svg";
import axios from "axios";
import { useAuth } from "../../Context/ContextProvider";
import { useLocation, useNavigate } from "react-router-dom";
const LoginPage = () => {
  // const [name, setName] = useState("");
  // const [role, setRole] = useState("user");
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setError] = useState({
    NameError: "",
    PassError: "",
    CatchError: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  // const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = import.meta.env.VITE_API_URL;
  // console.log("API Base URL:", API_URL);
  const VerifyUser = async (e) => {
    e.preventDefault();
    for (let key in values) {
      if (!values[key]) {
        ValidateFields(key, values[key]);
      }
      // console.log(errors);
    }
    for (let key in errors) {
      if (errors[key]) {
        return;
      }
    }
    try {
      let vals = values;
      const valuesObj = {
        ...vals,
      };
      let role = "admin";
      let name = "santhakumar";
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("name", name);
      // login(name, role);
      // navigate("/liveOccupancy", { replace: true });
      console.log(valuesObj);
      const Result = await axios.post(`${API_URL}/auth/login`, valuesObj);

      console.log(Result);
      if (Result && Result.data.success == true) {
        // localStorage.setItem("token", token);
        // localStorage.setItem( "user", JSON.stringify({ ...Result.data.user, password: "" }));
        let user = Result.data.user.username;
        let vid = Result.data.user.vid;
        let role = Result.data ? Result.data.user.role : "";
        let token = Result?.data?.token.token;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("username", user);
        sessionStorage.setItem("vid", vid);
        login(user, role);
        navigate("/liveOccupancy", { replace: true });
        setValues({ name: "", password: "" });
      } else if (Result && Result.data.success == false) {
        errors.CatchError = Result.data ? Result.data.message : "";
        setError({ ...errors });
      }
    } catch (error) {
      console.log(error);
      errors.CatchError = error.response ? error.response.data.message : "";
      setError({ ...errors });
    }
  };

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    let inputvalues = values;
    // console.log(inputvalues);
    ValidateFields(name, value);
    inputvalues[name] = value;
    setValues({ ...inputvalues });
  };
  const ValidateFields = (name, value) => {
    const error = errors;
    switch (name) {
      case "username":
        if (!value) {
          error.NameError = "Name field is required";
          error.CatchError = "";
        } else {
          error.NameError = "";
        }
        break;
      case "password":
        if (!value) {
          error.PassError = "Password field is required";
          error.CatchError = "";
          // validForm.passwordValid = false;
        } else {
          error.PassError = "";
          // validForm.passwordValid = true;
        }
        break;

      default:
        break;
    }

    // toCheckErrorsAndValid(validForm);
    setError({ ...error });
    // console.log(error, "errors");
  };
  return (
    <div>
      <div className="Login_BgPage">
        <div className="login_Container">
          {/* Your login form components go here */}
          <div className="OccupancyHeader">
            <img src={logoicon} />
          </div>
          <form
            onSubmit={(e) => {
              VerifyUser(e);
            }}
          >
            {/* <h4 className="loginHeader">Login</h4> */}
            <div className="formfield">
              <div className="FormSection">
                <label className="addExpenseLabel">Username</label>
                <input
                  type="text"
                  id="Name"
                  name="username"
                  value={values.username || ""}
                  onChange={(e) => onChangeHandler(e)}
                  className="form-control textfield"
                  // placeholder="Name"
                />
                {errors.NameError && (
                  <small className="email-error" style={{ color: "red" }}>
                    {errors.NameError}
                  </small>
                )}
              </div>

              <div className="FormSection">
                <label className="addExpenseLabel">Password</label>
                <input
                  type="password"
                  id="UserPassword"
                  name="password"
                  value={values.password || ""}
                  onChange={(e) => onChangeHandler(e)}
                  className="form-control textfield"
                  // placeholder="Password"
                />
                {errors.PassError && (
                  <small className="email-error" style={{ color: "red" }}>
                    {errors.PassError}
                  </small>
                )}
                {errors.CatchError && (
                  <small className="email-error" style={{ color: "red" }}>
                    {errors.CatchError}
                  </small>
                )}
              </div>
              <div> </div>
            </div>
            <div className="actBtn">
              <button
                type="submit"
                className="btn btn-primary lgnsbbtn"
                // onClick={VerifyUser}
              >
                Submit
              </button>
            </div>

            {/* <div>{Login()}</div> */}
          </form>
          <div className="LC_Section">
            <div className="LogcopyrightSec">
              <p className="cplabel">Copyright © 2025 All Rights Reserved by</p>
              <img src={Clogo} width="43px" height="13px" className="c_logo" />
            </div>
            <div className="LogoSec">
              <p className="splabel">Supported Browsers</p>
              <div className="SBrowserSec">
                <img
                  src={firefoxlogo}
                  width="12px"
                  height="12px"
                  className="c_logo"
                />
                <img
                  src={chromelogo}
                  width="12px"
                  height="12px"
                  className="c_logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
