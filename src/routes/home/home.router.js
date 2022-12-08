const express = require('express');
const homeRouter = express.Router();
const { checkAuth } = require('../../middleware/auth');
const { homePage } = require('./home.controller');

homeRouter.post('/',checkAuth,homePage);

module.exports=homeRouter