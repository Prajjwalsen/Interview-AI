
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const githubController = require("../controllers/github.controller");

const githubRouter = express.Router();

githubRouter.post(
    "/analyze",
    authMiddleware.authUser,
    githubController.analyzeGitHubController
);

module.exports = githubRouter;
