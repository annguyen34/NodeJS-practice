const express = require('express');
const tourRouter = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

tourRouter
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTour);

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
