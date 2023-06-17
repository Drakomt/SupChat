import express from "express";
import { addMessage, uploadMessageImage } from "../controllers/msg.js"
import { MessageImageStorage } from "../middlewares/multer.js";

const MessageRouter = express.Router();

MessageRouter.route("/addNewMessage")
.post(addMessage);

MessageRouter.route("/upload/:id")
.post(MessageImageStorage.single("image"), uploadMessageImage);

export default MessageRouter;