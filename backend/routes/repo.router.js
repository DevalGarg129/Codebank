const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.get("/repo/create", repoController.createRepository);
repoRouter.post("/repo/all", repoController.getAllRepositories);
repoRouter.post("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/:userID", repoController.fetchRepositriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);

module.exports = repoRouter;