const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("../../common/middleware/validate-request");
const { BadRequestError } = require("../../common/errors/bad-request-error");
const { User } = require("../models/user-model");
const jwt = require("jsonwebtoken");
const Web3 = require("web3");
// const { web3 } = require("../../common/web3.js");
const { web3 } = require('../../common/web3-lib');

const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"), //,
  ],
  validateRequest,
  async (req, res) => {
    const { email } = req.body;
    const account = await web3.eth.accounts.create();
    const address = account.address;

    // check if Email is already in use.
    const userExists = await User.findOne({
      email: email,
    });

    if (userExists) {
      throw new BadRequestError("User already exists");
    }

    // build new user
    const user = User.build({
      email,
      address,
    });

    await user.save();

    // generate JWT token
    const JWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: JWT,
    };

    res
      .status(201)
      .send({
        id: user.id,
        email: user.email,
        address: account.address,
        privateKey: account.privateKey,
      });
  }
);

router.post(
  "/api/auth/addemail",
  [
    body("email").isEmail().withMessage("Email must be valid"), //,
    body("address").not().isEmpty(),
  ],
  validateRequest,
  async (req, res) => {
    const { email, address } = req.body;
    const accounts = await web3.eth.getAccounts();
    if (!accounts.includes(address)) {
      throw new BadRequestError(
        "Account with the address does not exist on the blockchain"
      );
    }

    // check if Email is already in use.
    const userExists = await User.findOne({
      email: email,
    });

    if (userExists) {
      throw new BadRequestError("User with the email already exists");
    }

    const addressExists = await User.findOne({
      address: address,
    });

    if (addressExists) {
      throw new BadRequestError("User with the address already exists");
    }

    // build new user
    const user = User.build({
      email,
      address,
    });

    await user.save();

    // generate JWT token
    const JWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: JWT,
    };
    res.status(201).send(user);
  }
);

module.exports = { SingUpRouter: router };
