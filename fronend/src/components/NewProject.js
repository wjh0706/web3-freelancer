import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import BackButton from "./BackButton";
import Alert from "@mui/material/Alert";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

const NewProject = ({ setView }) => {
  const [creatorId, setcreatorId] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSafed, setIsSafed] = React.useState(true);
  const [errMsg, setErrMsg] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3001/api/auth/user/",
      withCredentials: true,
    })
      .then((res) => {
        setBalance(res.data.balanceEth);
        setcreatorId(res.data.currentUser.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [formData, setFormData] = useState({
    creatorId: creatorId, // Replace with actual creatorId from authentication
    verifierEmail: "", // Replace with actual verifierId from authentication
    projectName: "",
    projectDescription: "",
    posterCode: "",
    verificationCode: "",
    price: 0,
  });

  const handleChange = (e) => {
    setIsSafed(false);
    if (e.target.name === "verifierEmail") {
      setErrMsg("");
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChange = (newCode) => {
    setFormData({ ...formData, ["posterCode"]: newCode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setIsSafed(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/projects",
        formData,
        {
          withCredentials: true, // Include this line for credentials
        }
      );
      console.log("Project created:", response.data);
      setErrMsg("");
      setView("projectList");
    } catch (error) {
      setErrMsg("Invalid Verifier Email!");

      console.error("Error creating project:", error.message);
      // Add error handling logic or display an error message to the user
    } finally {
      // Set loading state to false after completion (whether success or error)
      setIsCreating(false);
    }
  };

  return (
    <Box m={2}>
      <h2>Create a New Project</h2>
      {errMsg && <Alert severity="error">{errMsg}</Alert>}
      <form onSubmit={handleSubmit}>
        {/* Project Details Section */}
        <Box mb={3}>
          <Typography variant="h6">Job Details</Typography>
          <TextField
            label="Project Name"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <TextField
            label="Project Description"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
        </Box>

        {/* Verifier Details Section */}
        <Box mb={3}>
          <Typography variant="h6">Verifier Details</Typography>
          <TextField
            label="Verifier's Email"
            name="verifierEmail"
            value={formData.verifierEmail}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <Typography variant="h6">Verification Code</Typography>
          <p>Enter the hash of your verification code using keccak256 on <a href="https://emn178.github.io/online-tools/keccak_256.html" target="_blank" rel="noopener noreferrer">https://emn178.github.io/online-tools/keccak_256.html</a>. This ensures we cannot cheat using your code.</p>
          <TextField
            label="Verification Code"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <Typography variant="h6">Test Code Provided by Job Poster</Typography>
          <AceEditor
            mode="python"
            theme="github"
            onChange={onChange}
            value={formData.posterCode}
            editorProps={{ $blockScrolling: false }}
            style={{ width: "100%", height: "500px" }}
          />
        </Box>

        {/* Pricing Section */}
        <Box mb={3}>
          <Typography variant="h6">Pricing</Typography>
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
        </Box>

        {/* Add more sections and TextField components as needed */}
        {/* Buttons in a Grid */}
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            {/* Submit Button with CircularProgress */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isCreating}
              sx={{
                maxWidth: "300px", // Adjust the maxWidth as needed
                margin: "auto", // Center the button
              }}
            >
              {isCreating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Job"
              )}
            </Button>
          </Grid>
          <BackButton setView={setView} isSafed={isSafed}></BackButton>
        </Grid>
      </form>
    </Box>
  );
};

export default NewProject;
