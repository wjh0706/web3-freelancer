/**
 * Components: ProjectDetail
 * A component for editing project information, including project name, file management, settings, and deleting the project.
 * Props:
 * setView: A function to switch views.
 * project: The current project object to edit.
 * setProject: A function to set the edited project object.
 * setisLogged: A function to set the login status.
 * Functions:
 * handleSave: A function to save the changes made to the project name.
 * handleChange: A function to handle the changes made to the project name.
 * handleDelete: A function to delete the current project.
 * States:
 * info: A object of project information state that holds the current project object.
 * error: A boolean state that indicates whether there is an error with the project name.
 * errorMessage: A string of the error message to display when there is an error with the project name.
 * isSafed: A boolean state that indicates whether the changes made are saved.
 */

import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FilledInput from "@mui/material/FilledInput";
import isEmpty from "validator/lib/isEmpty";
import Alert from "@mui/material/Alert";
import DeleteButton from "./DeleteButton";
import Help from "./Help";
import BackButton from "./BackButton";
import Typography from "@mui/material/Typography";

const axios = require("axios").default;
//You may want to change the path of the markdown file you want to dispaly in the Help dialog.
const helpMarkDown =
  "https://raw.githubusercontent.com/wjh0706/web3-freelancer/main/README.md";

function ProjectDetail({ isCreatorOrVerifierOrSubmiter, setView, project, setProject, setisLogged, ...props }) {
  const [info, setInfo] = React.useState(project);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSafed, setIsSafed] = React.useState(true);

  const handleSave = () => {
    axios({
      method: "patch",
      url: "http://localhost:3001/api/projects/" + info.id,
      data: {
        projectName: info.projectName, // send updated project name to server
      },
    })
      .then((res) => {
        setProject(info); // update project name in app state
        setIsSafed(true); // set the saved flag to true
      })
      .catch((err) => {
        if (isEmpty(info.projectName)) {
          // check if project name is empty
          setErrorMessage("The project name must not be empty.");
          setError(true);
          setIsSafed(false); // set the saved flag to false
        }
      });
  };

  const handleDelete = () => {
    axios({
      method: "delete",
      url: "http://localhost:3001/api/projects/" + info.id,
      data: {},
    }).then((res) => {
      setProject(res.data); // update app state with the deleted project
      setView("projectList"); // go back to the project list view
    });
  };

  // Render the ProjectDetail component
  return (
    <div>
      <Stack spacing={2} style={{ margin: 16 }}>
        <Grid
          container
          justifyContent="left"
          alignItems="center"
          margin="16"
          spacing={3}
        >
          <Grid item>
            {/* Help button */}
            <Help helpMarkDown={helpMarkDown} />
          </Grid>
        </Grid>
        {error && <Alert severity="error">{errorMessage}</Alert>}

        <Grid container spacing={1} justifyContent="center" alignItems="center">
          {/* Display other project details as needed */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Project Details</Typography>
            <Typography>Contract Address: {info.contractAddress}</Typography>
            <Typography>Link of Verification Code: {info.linkOfVerCode}</Typography>
            <Typography>Project Description: {info.projectDescription}</Typography>
            <Typography>Created At: {info.createdAt}</Typography>
            <Typography>Process Status: {info.processStatus}</Typography>
            <Typography>Price: {info.price}</Typography>
            {isCreatorOrVerifierOrSubmiter && <Typography>Output File: {info.output_file || 'Not submitted'}</Typography>}
            {!isCreatorOrVerifierOrSubmiter && <Typography>You have no permission to see the output file.</Typography>}
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          style={{ display: "flex", direction: "column" }}
          justifyContent="center"
          alignItems="center"
        >
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="right"
          alignItems="center"
          margin={16}
          spacing={1.5}
        >
          {/* Delete Job Button*/}
          <Grid item>
            <DeleteButton
              onDelete={handleDelete}
              isDisabled={info.processStatus === "running"}
              deletedThing="project"
              marginVar={0}
              size="large"
              buttonName="Delete Job"
            ></DeleteButton>
          </Grid>
          {/* Back Button*/}
          <BackButton setView={setView} isSafed={isSafed}></BackButton>
        </Grid>
      </Stack>
    </div>
  );
}
export default ProjectDetail;
