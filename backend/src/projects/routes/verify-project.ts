import {ProcessStatus} from '../../common/src/events/types/process-status';
import { requireAuth} from '../../common/src/middleware/require-auth';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/project';

const router = express.Router();

router.put('/api/projects/verify/:projectId', requireAuth, async (req: Request, res: Response) => {
    const {verificationcode} = req.body;

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
        throw new BadRequestError('Invalid Project Id');
    }
    const project = await Project.findById(req.params.projectId)

    if(!project){
        throw new BadRequestError('Invalid Project Id');
    }

    if(req.currentUser!.id != project.verifierId){
        throw new BadRequestError('You can not verify the work');
    }

    if(verificationcode == project.verificationcode){
        project.set('processStatus', ProcessStatus.Completed);

        await project.save();
    }

    res.send( { project });
})

export { router as verifyProjectRouter };