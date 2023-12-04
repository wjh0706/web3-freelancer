const express = require('express');
const { Project } = require('../models/project');
const mongoose = require('mongoose');
const { requireAuth } = require('../../common/middleware/require-auth');
const { validateRequest } = require('../../common/middleware/validate-request');
const { BadRequestError } = require('../../common/errors/bad-request-error');
const { body } = require('express-validator');

const router = express.Router();

router.patch('/api/projects/:id', requireAuth, [
  body('projectName')
    .isString()
    .isLength({
      min: 1
    })
    .not()
    .isEmpty()
    .withMessage('Project Name cannot be empty')
], validateRequest, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new BadRequestError('Invalid Project Id');
  }

  const { projectName } = req.body;
  const projectId = req.params.id;

  // Update the project's name
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { projectName },
    { new: true } // Set { new: true } to return the updated project
  );

  if (!updatedProject) {
    throw new BadRequestError('Project Not Found');
  }

  res.status(200).send(updatedProject);
});

module.exports = { projectUpdateRouter: router };
