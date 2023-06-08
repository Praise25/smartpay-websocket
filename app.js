require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.LOCALHOST ||
      "https://smartpay-websocket-production.up.railway.app/",
  },
});
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

io.on("connection", (socket) => {
  const handshake = socket.handshake;
  const { smartPayId, platform } = handshake.query;
  console.log("==========================================");
  console.log("A new client connected");
  console.log(`Platform: ${platform}`);
  console.log(`ID: ${smartPayId}`);
  console.log("==========================================");

  socket.join(smartPayId);

  socket.on("disconnecting", (reason) => {
    console.log(`Client ${smartPayId} is about to be disconnected`);
    console.log(`Reason: ${reason}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${smartPayId} has disconnected`);
    console.log(`Reason: ${reason}`);
  });

  socket.on("new transaction", () => {
    socket.to(smartPayId).emit("new transaction");
  });

  socket.on("testing", (platform) => {
    console.log(`Test: Connection established on ${platform}...`);
  });
});

app.get("/", (req, res) => {
  res.send("Server is up...");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
