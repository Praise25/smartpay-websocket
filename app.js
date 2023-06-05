const express = require("express");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

io.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("new transaction", () => {
    socket.broadcast.emit("new transaction");
  });

  socket.on("testing", (platform) => {
    console.log(`Test connection established on ${platform}...`);
  });
});

app.get("/", (req, res) => {
  res.send("Server is up...");
});

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
