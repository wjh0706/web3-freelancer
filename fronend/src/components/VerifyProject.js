import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const VerifyProject = ({ projectId,setView }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerify = async () => {
    try {
      // Make a PUT request to the API endpoint
      const response = await axios.put(`http://localhost:3001/api/projects/verify/${projectId}`, { verificationcode: verificationCode} , {
        withCredentials: true, // Include this line for credentials
      });
      // Handle the response as needed, e.g., show success message
      console.log('Project verified:', response.data.project);
      setView('projectList')
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error verifying project:', error.message);
    }
  };

  return (
    <div>
      <h2>Verify Project</h2>
      <TextField
        label="Verification Code"
        variant="outlined"
        fullWidth
        value={verificationCode}
        onChange={handleCodeChange}
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleVerify}>
        Verify Project
      </Button>
    </div>
  );
};

export default VerifyProject;
