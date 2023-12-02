const { NotAuthorizedError } = require('../errors/not-authorized-error');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};

module.exports = { requireAuth };
