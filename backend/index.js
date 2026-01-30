const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");

const express = require("express");

const app = express();
yargs(hideBin(process.argv)).command(
  "init",
  "Initialize a new repository",
  {},
  initRepo,
).demandCommand(1, "you need at least one command before moving on").help().argv;

yargs(hideBin(process.argv)).command(
    "add",
    "Add files to the staging area",
    {},
    addRepo,
).demandCommand(1, "you need at least one command before moving on").help().argv;
