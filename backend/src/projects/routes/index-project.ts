import express, { Request, Response } from "express";
import { Project } from "../models/project";
import mongoose from "mongoose";
import { requireAuth} from '../../common/src/middleware/require-auth';
import { BadRequestError} from '../../common/src/errors/bad-request-error';

const router = express.Router();

router.get(
  "/api/projects/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      throw new BadRequestError("Invalid Project Id");
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new BadRequestError("Project Not Found");
    }

    // project.populate('zip_fileId')
    // project.populate('extrinsic_fileId')
    // project.populate('intrinsic_fileId')
    // project.populate('multi_view_fileId')
    project.populate("output_file");

    res.status(200).send({ project: project });
  }
);

router.get(
  "/api/projects",
  requireAuth,
  async (req: Request, res: Response) => {
    const projects = await Project.find({
    })
      // .populate("zip_fileId")
      // .populate("extrinsic_fileId")
      // .populate("intrinsic_fileId")
      // .populate("output_file")
      // .populate("multi_view_fileId");

    res.status(200).send({ projects });
  }
);

export { router as projectIndexRouter };
