const express = require('express');
const { checkAuth } = require('../../middleware/auth');
const { signUp,login,changePassword,checkToken } = require('./user.controller');
const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login);
userRouter.post('/changePassword',checkAuth,changePassword);
userRouter.post('/checkToken',checkToken)

module.exports = userRouter;