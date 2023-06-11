import express from "express";
import { login, signUp, addContact, addChat, getUserByToken,/* , verifyToken */ 
uploadUserImage} from "../controllers/user.js"
import { Sup } from "../repository/Sup.js";
import { UserImageStorage } from "..//middlewares/multer.js";
const Dal = new Sup();
const UserRouter = express.Router();

UserRouter.route("/getUserByToken")
.post(getUserByToken);

UserRouter.route("/login")
.post(login);

UserRouter.route("/signUp")
.post(UserImageStorage.single('image'), signUp);

UserRouter.route("/uploadUserImage/:id")
.post(UserImageStorage.single('image'),uploadUserImage)

UserRouter.route("/addContact")
.put(Dal.userRep.verifyToken,addContact);

UserRouter.route("/addNewChat")
.post(addChat);

export default UserRouter;
