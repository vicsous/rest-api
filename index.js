require('express-async-errors');
require('./functions/startup')();
const pjson = require('./package.json');
const { dbConnect } = require('./middlewares/dbConnection');
const { createAdmin } = require('./middlewares/createAdmin');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Adicionar tratamento de eventos para erros não capturados
process.on('uncaughtException', (err) => {
    logger.error(err);
});
  
// Adicionar tratamento de eventos para promessas não capturadas
process.on('unhandledRejection', (reason) => {
    logger.error(reason);
});

// Cors
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
  }));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger
const logger = require('./functions/logger');

// Routers
const login = require('./routes/login');
const logout = require('./routes/logout');
const refresh = require('./routes/refresh');
const signup = require('./routes/signup');
const user = require('./routes/user');

// Port
const port = process.env.PORT || 3001;

// MongoDB connection
dbConnect(process.env.DB_HOST);

// MongoDB admin check
createAdmin();

// Routes
app.get('/', (req, res) => {
    return res.status(200).send(pjson.name + ' v.' + pjson.version);
})

// Routes
app.get('/api/test', (req, res) => {
    return res.status(200).send('test');
})

app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/refresh', refresh);
app.use('/api/signup', signup);
app.use('/api/user', user);

// 404 handler
app.use((req, res) => {
    res.sendStatus(404);
});

//  Error handler
app.use(errorHandler);

app.listen(port, logger.info(`MongoDB Server running on port ${port}`));