const express = require("express");
const { requireAuth } = require("../../common/middleware/require-auth");
const { validateRequest } = require("../../common/middleware/validate-request");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const expressValidator = require("express-validator");
const { Project } = require("../models/project");
const { User } = require("../../auth/models/user-model");
const { deploy } = require("../../deploy");
const { web3, abi } = require("../../common/web3-lib");

const router = express.Router();
router.post(
  "/api/projects",
  requireAuth,
  [
    expressValidator
      .body("projectName")
      .isString()
      .isLength({
        min: 1,
      })
      .not()
      .isEmpty()
      .withMessage("Project Name cannot be empty"),
    expressValidator
      .body("verifierEmail")
      .isEmail()
      .withMessage("Email must be valid"),
  ],
  validateRequest,
  async (req, res) => {
    const {
      projectName,
      verifierEmail,
      projectDescription,
      price,
      linkOfVerCode,
    } = req.body;
    const verificationCode = uuidv4();

    const verifier = await User.findOne({
      email: verifierEmail,
    });

    if (!verifier) {
      throw new BadRequestError(
        "No verifier associated with that email has been found"
      );
    }

    if (verifier.id == req.currentUser.id) {
      throw new BadRequestError("Job creator cannot be the verifier");
    }

    const { contractAddress, accountAddress } = await deploy(
      req.currentUser.address
    );

    const contract = new web3.eth.Contract(abi, contractAddress);

    console.log("Contract Address returned:", contractAddress);
    console.log("Account Address returned:", accountAddress);

    const project = Project.build({
      projectName: projectName,
      creatorId: req.currentUser.id,
      verifierId: verifier.id,
      price: price,
      linkOfVerCode: linkOfVerCode,
      contractAddress: contractAddress,
      projectDescription: projectDescription,
      createdAt: new Date(),
    });

    await project.save();

    // Save the verification code to a JSON file
    const verificationCodeData = { verification_code: verificationCode };
    fs.writeFileSync(
      "verification_code.json",
      JSON.stringify(verificationCodeData, null, 4)
    );

    const uintValue = parseInt(price, 10);

    // Log the info for debugging
    console.log(uintValue, verificationCode, req.currentUser.address);
    console.log("posting on:", contractAddress);
    // Proceed with posting the job using the smart contract
    try {
      await contract.methods.setThirdParty(verifier.address).send({
        from: req.currentUser.address,
        gas: 999999,
        type: "0x1",
      });

      await contract.methods.postJob(verificationCode, uintValue).send({
        from: req.currentUser.address,
        value: uintValue,
        gas: 999999,
        type: "0x1",
      });
      console.log("Job posting successful");
    } catch (error) {
      console.error("Error in posting job:", error);
    }

    res.status(201).send(project);
  }
);

module.exports = { projectNewRouter: router };
