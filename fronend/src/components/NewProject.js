import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NewProject = ({ setView }) => {
    const [creatorId, setcreatorId] = React.useState("");
    React.useEffect(() => {
        axios({
          method: "get",
          url: "http://localhost:3001/api/auth/user/",
          withCredentials: true,
        })
          .then((res) => {
            setcreatorId(res.data.currentUser.id);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

  const [formData, setFormData] = useState({
    creatorId: creatorId, // Replace with actual creatorId from authentication
    verifierEmail: '', // Replace with actual verifierId from authentication
    projectName: '',
    projectDescription: '',
    price: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/projects', formData, {
        withCredentials: true, // Include this line for credentials
      });
      console.log('Project created:', response.data);
      setView('projectList');
    } catch (error) {
      console.error('Error creating project:', error.message);
      // Add error handling logic or display an error message to the user
    }
  };

  return (
    <Box>
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit}>
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
        <TextField
          label="Verifier's Email"
          name="verifierEmail"
          value={formData.verifierEmail}
          onChange={handleChange}
          multiline
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
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

        {/* Add more TextField components as needed */}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Project
        </Button>
      </form>
    </Box>
  );
};

export default NewProject;
