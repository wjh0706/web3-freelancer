const express = require('express');
const { requireAuth } = require('../../common/src/middleware/require-auth');
const { BadRequestError } = require('../../common/src/errors/bad-request-error');
const { Project } = require('../models/project');

const router = express.Router();

router.delete('/api/projects/:id', requireAuth, async (req, res) => {
    if (!req.params.id) {
        throw new BadRequestError('Invalid id');
    }

    const deleted = await Project.findById(req.params.id);

    if (!deleted) {
        throw new BadRequestError('Project not found');
    }

    if (req.currentUser.id !== deleted.creatorId) {
        throw new BadRequestError('You are not the creator of this project.');
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(204).send({});
});

module.exports = { projectDeleteRouter: router };
