const express = require("express");
const { ProcessStatus } = require("../../common/process-status");
const { requireAuth } = require("../../common/middleware/require-auth");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const mongoose = require("mongoose");
const { Project } = require("../models/project");
const { exec } = require("child_process"); // Added missing import
const fs = require("fs"); // Added missing import
const path = require("path"); // Added missing import
const { web3, abi } = require("../../common/web3-lib");

const router = express.Router();

router.put("/api/projects/verify/:projectId", requireAuth, async (req, res) => {
  const { verificationcode } = req.body;

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

  const thirdPartyScriptPath = "./Submissions/thirdPartyCode.py"; // Removed extra parenthesis

  var isVerified = false;

  try {
    exec(`python3 "${thirdPartyScriptPath}"`, (error) => {
      if (error) {
        return res
          .status(500)
          .send({ message: `Error executing thirdPartyCode.py: ${error}` });
      }

      try {
        const fileContent = fs.readFileSync(
          path.join("verification_code.json"),
          "utf-8"
        );
        const verificationCode = JSON.parse(fileContent).verification_code;
        if (verificationCode == "3ac71829") {
          isVerified = true;
        }
      } catch (jsonError) {
        res
          .status(500)
          .send({ message: `Error reading the JSON file: ${jsonError}` });
      }
    });


    if (isVerified) {
      //if (verificationcode === project.verificationcode) {
      console.log("Preparing to call verifyWork on smart contract");
      await contract.methods.verifyWork("3ac71829").send({
        from: req.currentUser.address,
        gas: 999999,
        type: "0x1",
      });
      project.set("processStatus", ProcessStatus.Completed);
      await project.save();
      console.log("Job verification successful");
    } else {
      console.log("Job verification failed");
    }

    res.send({ project });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = { verifyProjectRouter: router };
