import {ProcessStatus} from '../../common/src/events/types/process-status';
import { requireAuth} from '../../common/src/middleware/require-auth';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/project';

const router = express.Router();

router.post('/api/projects/run/:projectId', requireAuth, async (req: Request, res: Response) => {

    if(!req.params.projectId || !mongoose.isObjectIdOrHexString(req.params.projectId)){
        throw new BadRequestError('Invalid Project Id');
    }
    const project = await Project.findById(req.params.projectId).populate('zip_fileId').populate('extrinsic_fileId').populate('intrinsic_fileId').populate('multi_view_fileId');

    if(!project){
        throw new BadRequestError('Invalid Project Id');
    }

    project.set('processStatus', ProcessStatus.Running);

    await project.save();

    res.send( { project });
})

export { router as runProjectRouter };