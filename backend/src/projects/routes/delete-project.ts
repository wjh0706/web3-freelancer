import express, { Request, Response } from 'express';
import { requireAuth} from '../../common/src/middleware/require-auth';
import { BadRequestError} from '../../common/src/errors/bad-request-error';
import { Project } from '../models/project';
//import { ProjectDeletedPublisher } from '../events/publishers/project-deleted-publisher';

const router = express.Router();

// router.delete('/api/projects', requireAuth, async (req: Request, res: Response) => {

//     const deleted = await Project.deleteMany({
//         userId: req.currentUser!.id
//     })

//     console.log(deleted);

//     res.status(204).send({});
// })
    
router.delete('/api/projects/:id', requireAuth, async (req:Request, res: Response) => {

    if(!req.params.id){
        throw new BadRequestError('Invalid id');
    }

    const deleted = await Project.findById(req.params.id);

    if(!deleted){
        throw new BadRequestError('Project not found');
    }

    if(req.currentUser!.id != deleted.creatorId){
        throw new BadRequestError('You are not the creator of this project.');
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(204).send({});
})

export { router as projectDeleteRouter }