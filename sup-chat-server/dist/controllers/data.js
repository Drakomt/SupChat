import { Sup } from "../repository/Sup.js";
import { Chat } from "../schemas/chat.js";
import { Message } from "../schemas/message.js";
import { User } from "../schemas/user.js";
const Dal = new Sup();
export const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('friends chats');
        res.send(JSON.stringify(users));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};
export const fetchNonFriendUsers = async (req, res) => {
    try {
        const currentUser = req.body;
        const allUsers = await User.find().select('_id');
        const friendIds = currentUser.friends.map((friend) => friend._id.toString());
        const unknownUsersId = allUsers.filter((user) => !friendIds.includes(user._id.toString()) && user._id.toString() !== req.body._id.toString());
        const unknownUsers = await User.find({
            _id: { $in: unknownUsersId }
        });
        res.send(JSON.stringify(unknownUsers));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};
export const findUserList = async (req, res) => {
    try {
        const usersIds = req.body;
        const users = await Dal.userRep.getManyById(usersIds);
        const usersData = users.map(user => {
            return { email: user.email, username: user.username, _id: user._id };
        });
        res.send(JSON.stringify(usersData));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};
export const fetchAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('user');
        res.send(JSON.stringify(messages));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};
export const fetchAllChats = async (req, res) => {
    try {
        /* const chats = await Chat.find().populate('participants messages admins'); */
        const chats = await Chat.find()
            .populate('participants')
            .populate('admins')
            .populate({
            path: 'messages',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
        console.log('chats: ', chats, chats[0].messages);
        res.send(JSON.stringify(chats));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};
//# sourceMappingURL=data.js.map