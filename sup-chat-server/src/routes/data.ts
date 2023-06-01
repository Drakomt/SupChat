import express from "express";
import { fetchAllChats, fetchAllMessages, fetchAllUsers, fetchNonFriendUsers, findUserList } from "../controllers/data.js"

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
.post(findUserList)

export default DataRouter;
