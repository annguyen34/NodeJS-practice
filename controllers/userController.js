const User = require('../models/userModel');
const catchAsync = require('../utils/CatchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: users,
  });
});

// Get user
exports.getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    requested: req.requestTime,
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    requested: req.requestTime,
    message: 'This route is not yet defined',
  });
};
