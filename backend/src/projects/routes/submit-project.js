const express = require('express');
const { ProcessStatus } = require('../../common/process-status');
const { requireAuth } = require('../../common/middleware/require-auth');
const { BadRequestError } = require('../../common/errors/bad-request-error');
const mongoose = require('mongoose');
const { Project } = require('../models/project');

const router = express.Router();

router.put('/api/projects/submit/:projectId', requireAuth, async (req, res) => {
    const { output_file } = req.body;

    if (!req.params.projectId || !mongoose.isValidObjectId(req.params.projectId)) {
        throw new BadRequestError('Invalid Project Id');
    }
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        throw new BadRequestError('Invalid Project Id');
    }

    if (req.currentUser.id === project.creatorId || req.currentUser.id === project.verifierId) {
        throw new BadRequestError('You cannot submit the work');
    }

    project.freelancerId = req.currentUser.id;
    project.output_file = output_file;
    project.set('processStatus', ProcessStatus.Submitted);

    await project.save();

    res.send({ project });
});

module.exports = { submitProjectRouter: router };
