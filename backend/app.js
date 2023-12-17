const express = require('express');
const cors = require('cors');
require('express-async-errors');
const { json } = require('body-parser');
const cookieSession = require('cookie-session');
const { currentUser } = require('./src/common/middleware/current-user');
const { errorHandler } = require('./src/common/middleware/error-handler');
const { NotFoundError } = require('./src/common/errors/not-found-error');
// Server endpoints import
//auth
const { SingUpRouter } = require('./src/auth/routes/auth-signup');
const { SingInRouter } = require('./src/auth/routes/auth-signin');
const { SingOutRouter } = require('./src/auth/routes/auth-signout');
const { UserRouter } = require('./src/auth/routes/auth-user');
//proj
const { projectDeleteRouter } = require('./src/projects/routes/delete-project');
const { projectNewRouter } = require('./src/projects/routes/new-project');
const { projectIndexRouter } = require('./src/projects/routes/index-project');
const { submitProjectRouter } = require('./src/projects/routes/submit-project');
// const { projectUpdateRouter } = require('./src/projects/routes/update-project');
const { verifyProjectRouter } = require('./src/projects/routes/verify-project');

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
}));
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false // To be configured later since JEST uses HTTP instead of HTTPS
}));
app.use(errorHandler);
app.use(currentUser);

// Server Routes
//auth
app.use(SingUpRouter);
app.use(SingInRouter);
app.use(SingOutRouter);
app.use(UserRouter);
// //proj
app.use(projectDeleteRouter);
app.use(projectNewRouter);
app.use(projectIndexRouter);
app.use(submitProjectRouter);
// app.use(projectUpdateRouter);
app.use(verifyProjectRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

module.exports = { app };
