import express from "express";
import { fetchAllChats, fetchAllMessages, fetchAllUsers, fetchNonFriendUsers, findUserList, uploadChatImage } from "../controllers/data.js";
import upload from "../middlewares/multer.js";
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
DataRouter.route("/upload/:id")
    .post(upload.single('image'), uploadChatImage);
export default DataRouter;
//# sourceMappingURL=data.js.map