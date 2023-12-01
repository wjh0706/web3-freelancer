import express from 'express';
import { body } from "express-validator";
import { validateRequest} from '../../common/src/middleware/validate-request';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from "../models/user-model";
import Web3 from 'web3';

const router = express.Router();

const web3 = new Web3(Web3.givenProvider || "http://ganache-cli:8545");

router.post('/api/auth/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('privateKey')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, privateKey } = req.body;

        const existingUser = await User.findOne({
            email
        })
        if(!existingUser){
            throw new BadRequestError('No user associated with that email has been found')
        }

        async function verifyAddressAndPrivateKey(address: string, privateKey: string): Promise<boolean> {
            try {
              const recoveredAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
              return address.toLowerCase() === recoveredAddress.toLowerCase();
            } catch (error) {
              console.error('Error:', error);
              return false;
            }
          }


        const passwordMatch = await verifyAddressAndPrivateKey(existingUser.address, privateKey); 
        if(!passwordMatch){
            throw new BadRequestError('Invalid Credentials');
        }

        const JWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, 
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: JWT
        }

        res.status(200).send(existingUser);
    }
)

export { router as SignInRouter };

