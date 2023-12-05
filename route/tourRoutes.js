const express = require('express');
const tourRouter = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

tourRouter
  .route('/top-5-tours')
  .get(
    authController.protect,
    tourController.aliasTopTours,
    tourController.getAllTour
  );

tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
tourRouter
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRouter;
