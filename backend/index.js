const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");

dotenv.config();
yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
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
  }, 
  (argv) => {
    revertRepo(argv.commitId);
  }
  )
  .demandCommand(1, "you need at least one command before moving on")
  .help().argv;


function startServer(){
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;
  mongoose
    .connect(mongoURI)
    .then(() => console.log("MONGODB connected successfully....."))
    .catch((err) => console.error("Unable to connect : ", err));

  app.use(cors({ origin: "*" }));
  app.get("/", (req, res) => {
    res.send("Welcome");
  })
  const user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST']
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("----------");
      console.log(user);
      console.log("----------");
      socket.join(userID);
    });
  })

  const db = mongoose.connection;
  db.once("open", async() => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on the port: ${port}`);
  })
}