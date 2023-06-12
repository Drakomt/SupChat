import express from "express";
import path from "path";
import http from "http";
import bodyparser from 'body-parser';
import cors from "cors";
import UserRouter  from "./routes/user.js"
// import mongoose from "mongoose";
import DataRouter from "./routes/data.js";
import MessageRouter from "./routes/msg.js";
import initSocketIO  from "./services/io.js";
import { mongoConnect } from "./services/mongo.js"

const app = express();
const port = 8080;
const server = http.createServer(app);

initSocketIO(server);

const MONGODB_URI = "mongodb://127.0.0.1:27017/supChat";

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true})); 
app.use(cors());
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

app.use("/", UserRouter);
app.use("/data", DataRouter);
app.use("/messages", MessageRouter)

app.get("/", (req, res) => {
  res.render("home");
});

const startServer = async () => {
  await mongoConnect();
  server.listen(port, () => {
    console.log(`Chat app listening on port ${port}!`);
  })
}

startServer();

// mongoose.connect(MONGODB_URI).then((result) => {
//   server.listen(port, () => {
//     console.log(`Chat app listening on port ${port}!`);
//   });
// });