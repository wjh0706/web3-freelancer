const express = require("express");
const { ProcessStatus } = require("../../common/process-status");
const { requireAuth } = require("../../common/middleware/require-auth");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const mongoose = require("mongoose");
const { Project } = require("../models/project");
const { web3, abi } = require("../../common/web3-lib");
const { promisify } = require("util");
const execAsync = promisify(require("child_process").exec);
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();

router.put("/api/projects/verify/:projectId", requireAuth, async (req, res) => {
  if (
    !req.params.projectId ||
    !mongoose.isValidObjectId(req.params.projectId)
  ) {
    throw new BadRequestError("Invalid Project Id");
  }
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    throw new BadRequestError("Invalid Project Id");
  }

  if (req.currentUser.id !== project.verifierId) {
    throw new BadRequestError("You cannot verify the work");
  }
  const contract = new web3.eth.Contract(abi, project.contractAddress);

  const poster = path.join(__dirname, "poster_code.py");
  await fs.writeFile(poster, project.posterCode);

  // Run the Python code from poster_code.py
  // await exec(`python3 ${poster}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error: poster code cannot be compiled!${error.message}`);
  //   } else {
  //     console.log(stdout);
  //   }
  // });

  const submitted = path.join(__dirname, "submitted_code.py");
  await fs.writeFile(submitted, project.submittedCode);

  // Run the Python code from submitted_code.py
  // await exec(`python3 ${submitted}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(
  //       `Error: submitted code cannot be compiled!${error.message}`
  //     );
  //   } else {
  //     console.log(stdout);
  //   }
  // });
  let verificationCode = "default";

  const pythonCode = `
import poster_code
import json

final_code = poster_code.code_returner()
print(final_code)
`;
  const verified = path.join(__dirname, "verify.py");
  await fs.writeFile(verified, pythonCode);
  console.log("Python code written to verify.py");

  // Run the Python code from verifierCode.py
  const { stdout, stderr } = await execAsync(
    `python3 ${verified}`
    //'python3 -c "import poster_code; import json; final_code = poster_code.code_returner(); print(final_code);"'
  );

  if (stderr) {
    console.error(`Error: verifierCode code cannot be compiled! ${stderr}`);
  } else {
    verificationCode = stdout.replace(/\n/g, "");
    console.log("pyoutput of code", verificationCode);
  }

  // Sleep for 2 seconds (2000 milliseconds)
  setTimeout(() => {
    //console.log("End");
  }, 2000);

  try {
    console.log("now using vercode", verificationCode);
    await contract.methods.verifyWork(verificationCode).send({
      from: req.currentUser.address,
      gas: 999999,
      type: "0x1",
    });
    console.log("Job verification successful");

    // Update project status and save
    project.set("processStatus", ProcessStatus.Completed);
    await project.save();
    res.send({ project });
  } catch (error) {
    console.log("error", verificationCode);
  }
});

module.exports = { verifyProjectRouter: router };
