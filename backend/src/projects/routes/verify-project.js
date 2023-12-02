const express = require("express");
const { ProcessStatus } = require("../../common/process-status");
const { requireAuth } = require("../../common/middleware/require-auth");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const mongoose = require("mongoose");
const { Project } = require("../models/project");
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
  try {
    project.set("processStatus", ProcessStatus.Completed);
    console.log("Preparing to call verifyWork on smart contract", project.contractAddress);
    console.log("from", req.currentUser.address);
    console.log("vercode", verificationcode);
    await contract.methods.verifyWork(verificationcode).send({
      from: req.currentUser.address,
      gas: 999999,
      type: "0x1",
    });
    console.log("Job verification successful");
    await project.save();
  }catch (error) {
    console.error("Error in verification:", error);
  }

  res.send({ project });
});

module.exports = { verifyProjectRouter: router };
