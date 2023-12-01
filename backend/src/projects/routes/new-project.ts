import { requireAuth } from "../../common/src/middleware/require-auth";
import { validateRequest } from "../../common/src/middleware/validate-request";
import { BadRequestError } from "../../common/src/errors/bad-request-error";

import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Project } from "../models/project";
import { User } from "../../auth/models/user-model";

const router = express.Router();

router.post(
  "/api/projects",
  requireAuth,
  [
    body("projectName")
      .isString()
      .isLength({
        min: 1,
      })
      .not()
      .isEmpty()
      .withMessage("Project Name cannot be empty"),
    body("verifierEmail").isEmail().withMessage("Email must be valid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      projectName,
      verifierEmail,
      projectDescription,
      price,
      verificationcode,
      linkOfVerCode,
    } = req.body;

    const verifier = await User.findOne({
      email: verifierEmail,
    });

    if (!verifier) {
      throw new BadRequestError(
        "No verifier associated with that email has been found"
      );
    }

    if (verifier.id == req.currentUser!.id) {
      throw new BadRequestError("Job creator cannnot be the verifier");
    }

    const project = Project.build({
      projectName: projectName,
      creatorId: req.currentUser!.id,
      verifierId: verifier.id,
      price: price,
      linkOfVerCode: linkOfVerCode,
      verificationcode: verificationcode,
      projectDescription: projectDescription,
      createdAt: new Date(),
    });

    await project.save();

    res.status(201).send(project);
  }
);

export { router as projectNewRouter };
