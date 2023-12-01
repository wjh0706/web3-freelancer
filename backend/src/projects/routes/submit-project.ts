import {ProcessStatus} from '../../common/src/events/types/process-status';
import { requireAuth} from '../../common/src/middleware/require-auth';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/project';

const router = express.Router();

router.put('/api/projects/submit/:projectId', requireAuth, async (req: Request, res: Response) => {
    const {output_file} = req.body;

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
        throw new BadRequestError('Invalid Project Id');
    }
    const project = await Project.findById(req.params.projectId)

    if(!project){
        throw new BadRequestError('Invalid Project Id');
    }

    if(req.currentUser!.id == project.creatorId || req.currentUser!.id == project.verifierId){
        throw new BadRequestError('You can not cubmit the work');
    }

    project.freelancerId = req.currentUser!.id
    project.output_file = output_file
    project.set('processStatus', ProcessStatus.Submitted);

    await project.save();

    res.send( { project });
})

export { router as submitProjectRouter };