import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SubmitProject = ({ projectId,setView }) => {
  const [outputFile, setOutputFile] = useState('');

  const handleFileChange = (e) => {
    setOutputFile(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Make a PUT request to the API endpoint
      const response = await axios.put(`http://localhost:3001/api/projects/submit/${projectId}`, { output_file: outputFile} , {
        withCredentials: true, // Include this line for credentials
      });

      // Handle the response as needed, e.g., show success message
      console.log('Project submitted:', response.data.project);
      setView('projectList')
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error submitting project:', error.message);
    }
  };

  return (
    <div>
      <h2>Submit Project</h2>
      <TextField
        label="Output File"
        variant="outlined"
        fullWidth
        value={outputFile}
        onChange={handleFileChange}
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Project
      </Button>
    </div>
  );
};

export default SubmitProject;
