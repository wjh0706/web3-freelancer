import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BackButton from "./BackButton";
import Typography from "@mui/material/Typography";

const VerifyProject = ({ projectId, setView }) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerify = async () => {
    try {
      // Make a PUT request to the API endpoint
      const response = await axios.put(
        `http://localhost:3001/api/projects/verify/${projectId}`,
        { verificationcode: verificationCode },
        {
          withCredentials: true, // Include this line for credentials
        }
      );
      // Handle the response as needed, e.g., show success message
      console.log("Project verified:", response.data.project);
      setView("projectList");
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error verifying project:", error.message);
    }
  };

  return (
    <Box m={2}>
      <div>
        <h2>Verify Job</h2>
        <br />
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              sx={{
                maxWidth: "300px", // Adjust the maxWidth as needed
                margin: "auto", // Center the button
              }}
            >
              Verify Job
            </Button>
          </Grid>
          <BackButton setView={setView} isSafed={true}></BackButton>
        </Grid>
      </div>
    </Box>
  );
};

export default VerifyProject;
