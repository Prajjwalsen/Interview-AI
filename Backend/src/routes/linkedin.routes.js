
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const linkedinController = require("../controllers/linkedin.controller");

const linkedinRouter = express.Router();

linkedinRouter.post(
    "/analyze",
    authMiddleware.authUser,
    linkedinController.analyzeLinkedInController
);

module.exports = linkedinRouter;
