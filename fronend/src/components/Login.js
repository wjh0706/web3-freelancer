/**
 * Components: Login
 * This component is responsible for the login page UI and functionality.
 * It receives props such as setView, setTabValue, and setisLogged.
 * The component renders a form with an email and privateKey input field and
 * two buttons, one for login and one for sign up.
 * It also displays an error message in case of invalid input.
 * Props:
 * setView: A function that sets the current view to either the login or sign-up page
 * setTabValue: A function that sets the current tab in the main application view
 * setisLogged: A function that sets the current login status of the user
 * Functions:
 * handleChange: A function that updates the values in the state based on user input
 * handleClickShowPassword: A function that toggles the visibility of the privateKey field
 * handleMouseDownPassword: A function that prevents the default behavior when the privateKey icon button is clicked
 * handlelogin: A function that handles the login functionality using Axios and sets the state accordingly
 * States:
 * values: An object that holds the current values of email and privateKey input fields
 * error: A boolean that holds whether an error occurred during login
 * errorMessage: A string that holds an error message occurred during login
 * showPassword: A boolean that holds whether the privateKey field should be visible or not
 */
import * as React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import isEmail from "validator/lib/isEmail";
import isEmpty from "validator/lib/isEmpty";

const axios = require("axios").default;

// Login component
function Login({ setView, setTabValue, setisLogged, ...props }) {
  // State variables using React hooks
  const [values, setValues] = React.useState({
    email: "",
    privateKey: "",
  });
  const [error, setError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Event handlers
  const handleChange = (type, event) => {
    if (type === "password") {
      setValues({ ...values, privateKey: event.target.value });
    } else if (type === "email") {
      setValues({ ...values, email: event.target.value });
    }
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlelogin = () => {
    // Make a POST request to the API endpoint using axios

    if (isEmail(values.email)){
      axios({
        method: "post",
        url: "http://localhost:3001/api/auth/signin/",
        data:  {
          email: values.email,
          password: values.privateKey,
        },
        withCredentials: true,
      })
        .then((response) => {
          setError(false);
          setisLogged(true);
          setTabValue("projects");
        })
        .catch((err) => {
          setError(true);
          if (!isEmail(values.email))
          setErrorMessage("The email you input is not a valid email address.");
        else if (isEmpty(values.privateKey))
          setErrorMessage("The privateKey must not be empty.");
        else
          setErrorMessage("Invalid email or pwd! Please check again!");
      });
    }else{
      axios({
        method: "post",
        url: "http://localhost:3001/api/auth/key/",
        data: {
          address: values.email,
          privateKey: values.privateKey,
        },
        withCredentials: true,
      })
        .then((response) => {
          setError(false);
          setisLogged(true);
          setTabValue("projects");
        })
        .catch((err) => {
          setError(true);
          // Set an error message based on the error response received
          setErrorMessage(
            "Invalid address or privateKey! Please check again!"
          );
        });
    }
  };

  // Login component UI
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ height: "40%", width: "30%", padding: "1%" }}>
        <CardContent>
          <h3>Sign In</h3>
          <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">Email or Address</InputLabel>
            <Input
              value={values.email}
              onChange={(e) => {
                handleChange("email", e);
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
            <InputLabel htmlFor="standard-adornment-privateKey">
              Password or PrivateKey
            </InputLabel>
            <Input
              id="standard-adornment-privateKey"
              type={showPassword ? "text" : "password"}
              value={values.privateKey}
              onChange={(e) => {
                handleChange("password", e);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle privateKey visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {/* Show error message if error state is true */}
          {error && <Alert severity="error">{errorMessage}</Alert>}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: "10%",
            }}
          >
            <Button
              variant="outlined"
              disableElevation
              onClick={() => {
                setView("signup");
              }}
              style={{ marginTop: "5%" }}
            >
              Sign up
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handlelogin}
              style={{ marginTop: "5%" }}
            >
              Log in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
