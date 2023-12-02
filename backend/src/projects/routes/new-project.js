const express = require('express');
const { requireAuth } = require('../../common/src/middleware/require-auth');
const { validateRequest } = require('../../common/src/middleware/validate-request');
const { BadRequestError } = require('../../common/src/errors/bad-request-error');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const expressValidator = require('express-validator');
const { Project } = require('../models/project');
const { User } = require('../../auth/models/user-model');

const router = express.Router();

router.post(
  '/api/projects',
  requireAuth,
  [
    expressValidator.body('projectName')
      .isString()
      .isLength({
        min: 1,
      })
      .not()
      .isEmpty()
      .withMessage('Project Name cannot be empty'),
    expressValidator.body('verifierEmail').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req, res) => {
    const {
      projectName,
      verifierEmail,
      projectDescription,
      price,
      verificationcode,
      linkOfVerCode,
    } = req.body;

    const verifier = await User.findOne({
      email: verifierEmail,
    });

    if (!verifier) {
      throw new BadRequestError(
        'No verifier associated with that email has been found'
      );
    }

    if (verifier.id == req.currentUser.id) {
      throw new BadRequestError('Job creator cannot be the verifier');
    }

    const project = Project.build({
      projectName: projectName,
      creatorId: req.currentUser.id,
      verifierId: verifier.id,
      price: price,
      linkOfVerCode: linkOfVerCode,
      verificationcode: verificationcode,
      projectDescription: projectDescription,
      createdAt: new Date(),
    });

    await project.save();

    // const verificationCode = uuidv4();

    // // Save the verification code to a JSON file
    // const verificationCodeData = { verification_code: verificationCode };
    // fs.writeFileSync(
    //   "verification_code.json",
    //   JSON.stringify(verificationCodeData, null, 4)
    // );

    // const uintValue = parseInt(price, 10);

    // // Log the info for debugging
    // console.log(uintValue, verificationcode, web3.eth.defaultAccount);

    // // Proceed with posting the job using the smart contract
    // try {
    //   await contract.methods
    //     .postJob(verificationCode, uintValue)
    //     .send({
    //       from: web3.eth.defaultAccount,
    //       value: uintValue,
    //       gas: 999999,
    //     });
    //   console.log("Job posting successful");
    // } catch (error) {
    //   console.error("Error in posting job:", error);
    // }

    res.status(201).send(project);
  }
);

module.exports = { projectNewRouter: router };
