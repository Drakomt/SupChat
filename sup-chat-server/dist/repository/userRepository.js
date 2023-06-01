//import { User } from "../models/user.js";
import { User } from "../schemas/user.js";
import { Repository } from "./repository.js";
import mongoose from "mongoose";
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
        return user;
    }
    async findById(id) {
        console.log("in findById id: ", id);
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
        console.log("in findById user: ", user);
        return user;
    }
}
//# sourceMappingURL=userRepository.js.map