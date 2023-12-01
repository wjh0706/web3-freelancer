import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {currentUser,} from './src/common/src/middleware/current-user';
import { errorHandler} from './src/common/src/middleware/error-handler';
import {  NotFoundError} from './src/common/src/errors/not-found-error';
// Server endpoints import
//auth
import { SingUpRouter } from './src/auth/routes/auth-signup';
import { SignInRouter } from './src/auth/routes/auth-signin';
import { SingOutRouter } from './src/auth/routes/auth-signout';
import { UserRouter } from './src/auth/routes/auth-user';
//proj
import { projectDeleteRouter } from './src/projects/routes/delete-project';
import { projectNewRouter } from './src/projects/routes/new-project';
import { projectIndexRouter } from './src/projects/routes/index-project';
import { runProjectRouter } from './src/projects/routes/run-project';
import { projectUpdateRouter } from './src/projects/routes/update-project';

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
  }))
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false // To be configured later since JEST uses HTTP instead of HTTPS
    })
);
app.use(errorHandler);
app.use(currentUser);

// Server Routes
//auth
app.use(SingUpRouter);
app.use(SignInRouter);
app.use(SingOutRouter);
app.use(UserRouter);
//proj
app.use(projectDeleteRouter);
app.use(projectNewRouter);
app.use(projectIndexRouter);
app.use(runProjectRouter);
app.use(projectUpdateRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

export { app }
