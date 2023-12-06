const User = require('../models/userModel');
const catchAsync = require('../utils/CatchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');

const signToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });
  const token = signToken(newUser);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check email and password
  if (!email || !password) {
    next(new AppError('Please provide email and password', 400));
  }
  // Check if password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Username and password is wrong !!'));
  }
  // Sign token
  const token = signToken(user);

  res.status(200).json({
    status: 'success',
    token,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The token belonging to this token does no longer exists.',
        401
      )
    );
  }

  // Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password changed', 401));
  }

  // Grant access
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check roles
    if (!roles.includes(req.user.role)) {
      console.log(req);
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send reset token to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Cant send email. Try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Todo
});
