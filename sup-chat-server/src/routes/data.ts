import express from "express";
import { fetchAllChats, fetchAllMessages, fetchAllUsers, fetchNonFriendUsers, fetchPrivateChat, findUserList, uploadChatImage } from "../controllers/data.js"
import { ChatImageStorage } from "../middlewares/multer.js";

const DataRouter = express.Router();

DataRouter.route("/users")
.get(fetchAllUsers);

DataRouter.route("/nonFriendUsers")
.post(fetchNonFriendUsers);

DataRouter.route("/messages")
.get(fetchAllMessages);

DataRouter.route("/chats")
.get(fetchAllChats);

DataRouter.route("/findUserList")
.post(findUserList);

DataRouter.route("/fetchPrivateChat")
.get(fetchPrivateChat);

DataRouter.route("/upload/:id")
.post(ChatImageStorage.single('image'),uploadChatImage)

export default DataRouter;
