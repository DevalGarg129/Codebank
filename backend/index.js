const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)

  .command("init", "Initialize repository", {}, initRepo)

  .command(
    "add <filePath>",
    "Add file",
    (yargs) => {
      yargs.positional("filePath", {
        describe: "Path of file",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.filePath);
    }
  )

  .command(
    "commit <message>",
    "Commit changes",
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

  .command("push", "Push repository", {}, pushRepo)

  .command("pull", "Pull repository", {}, pullRepo)

  .command(
    "revert <commitId>",
    "Revert repository",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit ID",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitId);
    }
  )

  .demandCommand(1, "Please provide a command")
  .help()
  .argv;

function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.error("MongoDB Connection Error:", err);
    });

  app.use("/", mainRouter);

  app.get("/", (req, res) => {
    res.send("Welcome to Codebank");
  });

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    socket.on("joinRoom", (userID) => {
      socket.join(userID);
      console.log(`User ${userID} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });

  mongoose.connection.once("open", () => {
    console.log("Mongo Connected");
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}