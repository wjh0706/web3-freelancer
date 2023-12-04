const express = require("express");
const { ProcessStatus } = require("../../common/process-status");
const { requireAuth } = require("../../common/middleware/require-auth");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const mongoose = require("mongoose");
const { Project } = require("../models/project");
const { web3, abi } = require("../../common/web3-lib");

const router = express.Router();

router.put("/api/projects/submit/:projectId", requireAuth, async (req, res) => {
  const { submittedCode } = req.body;

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

  if (
    req.currentUser.id === project.creatorId ||
    req.currentUser.id === project.verifierId
  ) {
    throw new BadRequestError("You cannot submit the work");
  }

  const contract = new web3.eth.Contract(abi, project.contractAddress);

  project.freelancerId = req.currentUser.id;
  await contract.methods.submitWork(submittedCode).send({
    from: req.currentUser.address,
    gas: 999999,
    type: "0x1",
  });
  console.log("Job submission successful");
  project.submittedCode = submittedCode;
  project.set("processStatus", ProcessStatus.Submitted);

  await project.save();

  res.send({ project });
});

module.exports = { submitProjectRouter: router };
