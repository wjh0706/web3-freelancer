import express from "express";
import { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest} from '../../common/src/middleware/validate-request';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import { User } from "../models/user-model";
import jwt from "jsonwebtoken";
import Web3 from "web3";

const router = express.Router();

const web3 = new Web3(Web3.givenProvider || "http://ganache-cli:8545");

router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"), //,
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const account = await web3.eth.accounts.create();
    //const address = accounts[userCount]
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
      //password,
      address,
    });

    await user.save();

    // generate JWT token
    const JWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
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
  async (req: Request, res: Response) => {
    const { email, address } = req.body;
    const accounts = await web3.eth.getAccounts();
    if (!accounts.includes(address)) {
      throw new BadRequestError(
        "Account with the adress does not exist on the blockchain"
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
      //password,
      address,
    });

    await user.save();

    // generate JWT token
    const JWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: JWT,
    };
    res.status(201).send(user);
  }
);

export { router as SingUpRouter };
