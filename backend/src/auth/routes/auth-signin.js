const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../../common/middleware/validate-request');
const { BadRequestError } = require('../../common/errors/bad-request-error');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user-model');
const { web3 } = require('../../common/web3-lib');

const router = express.Router();

router.post(
    '/api/auth/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('privateKey').trim().notEmpty().withMessage('You must supply a password'),
    ],
    validateRequest,
    async (req, res) => {
        const { email, privateKey } = req.body;

        const existingUser = await User.findOne({
            email,
        });
        if (!existingUser) {
            throw new BadRequestError('No user associated with that email has been found');
        }

        async function verifyAddressAndPrivateKey(address, privateKey) {
            try {
                const recoveredAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
                return address.toLowerCase() === recoveredAddress.toLowerCase();
            } catch (error) {
                console.error('Error:', error);
                return false;
            }
        }

        const passwordMatch = await verifyAddressAndPrivateKey(existingUser.address, privateKey);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid Credentials');
        }

        const JWT = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY
        );

        req.session = {
            jwt: JWT,
        };

        res.status(200).send(existingUser);
    }
);

module.exports = { SingInRouter: router };
