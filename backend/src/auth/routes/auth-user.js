const express = require('express');
const { currentUser } = require('../../common/middleware/current-user');

const router = express.Router();

router.get('/api/auth/user', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
});

module.exports = { UserRouter: router };
