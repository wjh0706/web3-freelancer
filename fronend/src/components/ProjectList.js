/**
 * Components: ProjectList
 * A component that displays a list of projects for a user and allows them to add new projects.
 * Props:
 * setView: A function to set the current view of the app
 * setTabValue: A function to set the value of the current tab
 * setProject: A function to set the current project
 * Functions:
 * handleAddProject: A function that creates a new project and generates a default configuration YAML file for it
 * handleChange: A function that handles changes to the project name input field
 * generateMultiViewConfig: A function that generates a default configuration YAML file for a new project
 * States:
 * numProjects: an array of objects representing the user's projects
 * email: A string of the email of the current user
 * projectName: A string of the name of a new project being added
 */
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import ProjectCard from "./ProjectCard";
import yaml from "js-yaml";

const axios = require("axios").default;

function ProjectList({ setView, setTabValue, setProject, ...props }) {
  // Define state variables numProjects, email, and projectName using React.useState()
  const [numProjects, setNumProjects] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [projectName, setProjectName] = React.useState("");

  // Get the current user's email using a GET request to the '/api/auth/user/' endpoint
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3001/api/auth/user/",
      withCredentials: true,
    })
      .then((res) => {
        setEmail(res.data.currentUser.email);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get a list of projects using a GET request to the '/api/projects/' endpoint
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3001/api/projects/",
      withCredentials: true,
    })
      .then((res) => {
        setNumProjects(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Define a handleAddProject function that creates a new project using a POST request to the '/api/projects/' endpoint
  // with a default project name if no project name is provided, and then generates a new multi-view configuration for the project
  const handleAddProject = () => {
    setView("newProject")
  };

  return (
    <div>
      <div>
        <div>
          <h3 style={{ margin: 16 }}>{"Welcome, " + email + "!"}</h3>
        </div>
        <Button
          variant="contained"
          style={{
            margin: 16,
          }}
          onClick={handleAddProject}
        >
          New Project
        </Button>
      </div>
      {/* display the list of projects */}
      <Box sx={{ flexGrow: 1 }} style={{ margin: 16 }}>
        <Grid
          container
          spacing={2}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          {numProjects &&
            numProjects.map((value) => (
              <ProjectCard
                key={value.id}
                setView={setView}
                value={value}
                setProject={setProject}
                setNumProjects={setNumProjects}
              />
            ))}
        </Grid>
      </Box>
    </div>
  );
}
export default ProjectList;
