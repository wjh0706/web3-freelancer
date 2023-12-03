import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import BackButton from "./BackButton";

const SubmitProject = ({ projectId, setView }) => {
  const [outputFile, setOutputFile] = useState("");
  const [isSafed, setIsSafed] = useState(true);

  const handleFileChange = (e) => {
    setIsSafed(false);
    setOutputFile(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSafed(true);
    try {
      // Make a PUT request to the API endpoint
      const response = await axios.put(
        `http://localhost:3001/api/projects/submit/${projectId}`,
        { output_file: outputFile },
        {
          withCredentials: true, // Include this line for credentials
        }
      );

      // Handle the response as needed, e.g., show success message
      console.log("Project submitted:", response.data.project);
      setView("projectList");
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error submitting project:", error.message);
    }
  };

  return (
    <Box m={2}>
      <div>
        <h2>Submit Job</h2>
        <Typography variant="h6">Submission File Link</Typography>
        <TextField
          label="Submission File Link"
          variant="outlined"
          fullWidth
          value={outputFile}
          margin="normal"
          onChange={handleFileChange}
        />
        <br />
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                maxWidth: "300px", // Adjust the maxWidth as needed
                margin: "auto", // Center the button
              }}
            >
              Submit Job
            </Button>
          </Grid>
          <BackButton setView={setView} isSafed={isSafed}></BackButton>
        </Grid>
      </div>
    </Box>
  );
};

export default SubmitProject;
