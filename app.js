const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const { startConn } = require('./helpers/connectDb');
const bodyParser = require('body-parser');

const { errorHandler } = require('./middleware/errorHandler');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const { guard } = require('./middleware/guard');

const options = require('./configs/optSwagger').options;

const specs = swaggerJsdoc(options);

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use(startConn);
app.use(guard);
app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter.router);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

module.exports = app;
