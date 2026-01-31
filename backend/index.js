const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");

yargs(hideBin(process.argv))
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <filePath>",
    "Add file to the repository",
    (yargs) => {
      yargs.positional("filePath", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.filePath);
    }
  )
  .command(
    "commit <message>",
    "commit changes to the repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push changes to S3", {}, pushRepo)
  .command("pull", "Pull changes from S3", {}, pullRepo)
  .command("revert <commitId>", "Revert to a specific commit", (yargs) => {
    yargs.positional("commitId", {
      describe: "Id of the commit to revert to",
      type: "string",
    });
  }, revertRepo
  )
  .demandCommand(1, "you need at least one command before moving on")
  .help().argv;
