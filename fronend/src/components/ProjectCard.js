/**
 * Components: ProjectCard
 * This component represents the project card component that shows the project name, creation date, and status. It also contains buttons to edit, delete, and download the project, depending on the project's status.
 * Props:
 * setNumProjects: a function to set the total number of projects.
 * setView: a function to set the current view of the user.
 * value: an object containing the project's information.
 * setProject: a function to set the current project being edited.
 * setisLogged: a function to set the current logged-in status of the user.
 * Functions:
 * handleEdit: a function to handle the edit button click.
 * handleDelete: a function to handle the delete button click.
 * handleDownload: a function to handle the download button click.
 * States:
 * errorMsg: a string representing the error message if there's any.
 * error: a boolean value indicating if there's an error.
 * buttonName: a string representing the name of the button displayed in the project card.
 * projectInfo: an object containing the project's information such as the project name, creation date, status, etc.
 */
import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import DeleteButton from "./DeleteButton";

const axios = require("axios").default;

function ProjectCard({
  setIsCreatorOrVerifierOrSubmiter,
  setNumProjects,
  setView,
  value,
  setProject,
  setisLogged,
  ...props
}) {
  // Define state variables using React.useState hook
  const [errorMsg, setErrorMsg] = React.useState("");
  const [error, setError] = React.useState(false);
  const [projectInfo, setInfo] = React.useState({
    creatorId: value.creatorId,
    verifierId: value.verifierId,
    projectName: value.projectName,
    posterCode: value.posterCode,
    projectDescription: value.projectDescription,
    createdAt: value.createdAt,
    lastModifiedAt: value.lastModifiedAt,
    processStatus: value.processStatus,
    version: value.version,
    price: value.price,
    submittedCode: value.submittedCode,
    id: value.id,
  });
  const [userId, setUserId] = React.useState("");
  React.useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:3001/api/auth/user/",
      withCredentials: true,
    })
      .then((res) => {
        setIsCreatorOrVerifierOrSubmiter(
          res.data.currentUser.id === value.creatorId ||
            res.data.currentUser.id === value.verifierId ||
            res.data.currentUser.id === value.freelancerId
        );
        setUserId(res.data.currentUser.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Define event handler functions
  const handleEdit = () => {
    setProject(value);
    setView("projectEdit");
  };

  const handleDelete = () => {
    axios({
      method: "delete",
      url: "http://localhost:3001/api/projects/" + value.id,
      withCredentials: true,
    })
      .then((res) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    setProject(value);
    setView("submitProject");
  };

  const handleVerify = () => {
    setProject(value);
    setView("verifyProject");
  };

  return (
    <Card style={{ height: "30%", width: "20%", margin: 16, padding: 10 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {projectInfo.projectName ? projectInfo.projectName : "Project"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Created at " + new Date(projectInfo.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Status is " + projectInfo.processStatus}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {"Price is " + projectInfo.price + " ETH"}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          spacing={1}
          alignItems="center"
          margin="auto"
        >
          {/*Edit button*/}
          <Grid item>
            <Button
              variant="contained"
              onClick={handleEdit}
            >
              Details
            </Button>
          </Grid>
          {/*Delete button (disabled when the project is running)*/}
          <Grid item>
            <DeleteButton
              onDelete={handleDelete}
              marginVar={8}
              isDisabled={projectInfo.creatorId != userId}
              deletedThing="project"
              size="medium"
              buttonName="Delete"
            ></DeleteButton>
          </Grid>
          {/*Download/Run/Try Again button (disabled when the project is running, only showing running)*/}
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleSubmit}
              disabled={
                projectInfo.processStatus != "not-started" ||
                projectInfo.creatorId === userId ||
                projectInfo.verifierId === userId
              }
            >
              Submit Code
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleVerify}
              disabled={
                projectInfo.processStatus != "submitted" ||
                projectInfo.verifierId != userId
              }
            >
              Verify
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      {error && (
        <Alert style={{ justifyContent: "center" }} severity="error">
          {errorMsg}
        </Alert>
      )}
    </Card>
  );
}

export default ProjectCard;
