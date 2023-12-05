const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./route/tourRoutes');
const userRouter = require('./route/userRoutes');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// Handle error - unhandled url
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(errorController);
module.exports = app;
