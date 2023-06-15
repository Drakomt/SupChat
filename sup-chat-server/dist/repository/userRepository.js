//import { User } from "../models/user.js";
import { User } from "../schemas/user.js";
import { Repository } from "./repository.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
export class UserRepository extends Repository {
    constructor(model) {
        super(model);
    }
    async findByEmail(email) {
        const user = await User.findOne({ email })
            .populate('friends')
            .populate({
            path: 'chats',
            model: 'Chat',
            populate: {
                path: 'messages',
                populate: { path: 'user', select: 'username email' },
                model: 'Message'
            }
        });
        const privateChatsUser = await User.findOne({ email })
            .populate({
            path: 'chats',
            model: 'Chat',
            match: { name: 'private chat' },
            populate: {
                path: 'participants',
                model: 'User'
            }
        });
        let chatIndex = 0;
        let privateIndex = 0;
        while (chatIndex < user.chats.length && privateIndex < privateChatsUser.chats.length) {
            if (privateChatsUser.chats[privateIndex]._id.toString() !== user.chats[chatIndex]._id.toString())
                chatIndex += 1;
            else {
                user.chats[chatIndex].participants = privateChatsUser.chats[privateIndex].participants;
                privateIndex += 1;
            }
        }
        return user;
    }
    async findById(id) {
        const { ObjectId } = mongoose.Types;
        const user = await User.findOne({ _id: new ObjectId(id) })
            .populate('friends')
            .populate({
            path: 'chats',
            model: 'Chat',
            populate: {
                path: 'messages',
                populate: { path: 'user', select: 'username email' },
                model: 'Message'
            }
        });
        const privateChatsUser = await User.findOne({ _id: new ObjectId(id) })
            .populate({
            path: 'chats',
            model: 'Chat',
            match: { name: 'private chat' },
            populate: {
                path: 'participants',
                model: 'User'
            }
        });
        let chatIndex = 0;
        let privateIndex = 0;
        while (chatIndex < user.chats.length && privateIndex < privateChatsUser.chats.length) {
            if (privateChatsUser.chats[privateIndex]._id.toString() !== user.chats[chatIndex]._id.toString())
                chatIndex += 1;
            else {
                user.chats[chatIndex].participants = privateChatsUser.chats[privateIndex].participants;
                privateIndex += 1;
            }
        }
        return user;
    }
    async verifyToken(request, response, next) {
        console.log("req body: ", request.body);
        const token = request.body.token;
        if (!token) {
            console.log("******************* Token not found: ", token, " *******************");
            return response.status(401).json({ message: "No token provided" });
        }
        jwt.verify(token, "mySecretKey", (error, decodedToken) => {
            if (error) {
                console.log("******************* Error in verify Token: ", token, " *******************");
                return response.status(403).json({ message: "Invalid token" });
            }
            // Add the decoded token to the request object for further use
            request.decodedToken = decodedToken;
            next();
        });
    }
    async isValidToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, "mySecretKey", (error) => {
                if (error) {
                    console.log("******************* Error in verify Token: ", token, " *******************");
                    resolve(false); // Token verification failed
                }
                else {
                    resolve(true); // Token verification succeeded
                }
            });
        });
    }
}
//# sourceMappingURL=userRepository.js.map