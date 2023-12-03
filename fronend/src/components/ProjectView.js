/**
 * Components: ProjectView
 * This component renders either the ProjectList or ProjectDetail component based on the value of 'view' state.
 * Props:
 * setTabValue: a function to update the active tab value in the parent component
 * setisLogged: a function to update the login status in the parent component
 * Functions:
 * None
 * States:
 * view: a string state to determine which component to render. It can have the value of either 'projectList' or 'projectEdit'.
 * project: a state to store the currently selected project object.
 */
import * as React from "react";

import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
import NewProject from "./NewProject";
import SubmitProject from "./SubmitProject";
import VerifyProject from "./VerifyProject";

function ProjectView({ setTabValue, setisLogged }) {
  const [view, setView] = React.useState("projectList");
  const [project, setProject] = React.useState(null);
  const [isCreatorOrVerifierOrSubmiter,setIsCreatorOrVerifierOrSubmiter] = React.useState(false)

  return (
    <>
      {view === "projectList" && (
        <ProjectList
          setView={setView}
          setProject={setProject}
          setIsCreatorOrVerifierOrSubmiter={setIsCreatorOrVerifierOrSubmiter}
          setTabValue={setTabValue}
          setisLogged={setisLogged}
        />
      )}
      {view === "projectEdit" && (
        <ProjectDetail
          setView={setView}
          project={project}
          setProject={setProject}
          setisLogged={setisLogged}
          isCreatorOrVerifierOrSubmiter={isCreatorOrVerifierOrSubmiter}
        />
      )}
      {view === "newProject" && (
        <NewProject setView={setView}
        />
      )}
            {view === "submitProject" && (
        <SubmitProject setView={setView} projectId={project.id}
        />
      )}
                  {view === "verifyProject" && (
        <VerifyProject setView={setView} projectId={project.id}
        />
      )}
    </>
  );
}

export default ProjectView;
