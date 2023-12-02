const jwt = require('jsonwebtoken');

/**
 * @typedef {Object} UserPayload
 * @property {string} id
 * @property {string} email
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const currentUser = (req, res, next) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = /** @type {UserPayload} */ (payload);
    } catch (err) {}

    next();
};

module.exports = { currentUser };
