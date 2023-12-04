const express = require('express');
const { Project } = require('../models/project');
const mongoose = require('mongoose');
const { requireAuth } = require('../../common/middleware/require-auth');
const { BadRequestError } = require('../../common/errors/bad-request-error');

const router = express.Router();

router.get('/api/projects/:id', requireAuth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new BadRequestError('Invalid Project Id');
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
        throw new BadRequestError('Project Not Found');
    }
    project.populate('submittedCode');

    res.status(200).send({ project: project });
});

router.get('/api/projects', requireAuth, async (req, res) => {
    const projects = await Project.find({});
    res.status(200).send({ projects });
});

module.exports = { projectIndexRouter: router };
