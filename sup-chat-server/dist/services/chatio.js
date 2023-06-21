import { Sup } from "../repository/Sup.js";
import { Chat } from "../schemas/chat.js";
import { Message } from "../schemas/message.js";
const Dal = new Sup();
//events name
const newMessageEventName = "message";
const joinRoomEventName = "joinRoom";
const leaveRoomEventName = "leaveRoom";
const addToRoomEventName = "addToRoom";
const removeFromRoomEventName = "removeFromRoom";
const createChatEventName = "newChat";
const updateChatEventName = "updateChat";
const newMessage = async (data, io, socket) => {
    console.log(`new message recived: ${data.message}`);
    const { message: messageData, chat_id } = data;
    const newMessage = new Message({
        text: messageData.text,
        // image: messageData.image,
        dateTime: messageData.dateTime,
        user: messageData.user._id,
    });
    await Dal.messageRep.add(newMessage);
    const chat = await Dal.chatRep.getById(chat_id);
    chat.messages.push(newMessage);
    Dal.chatRep.update(chat_id, chat);
    socket.broadcast.to(chat_id).emit("message", data);
};
const joinRoom = async (room_id, io, socket) => {
    socket.join(room_id);
};
const leaveRoom = async (room_id, io, socket) => {
    socket.leave(room_id);
};
const addToRoom = async (data, io, socket) => {
    const { chat_id, user_id } = data;
    const chat = await Dal.chatRep.getById(chat_id);
    const user = await Dal.userRep.getById(user_id);
    chat.participants.push(user);
    user.chats.push(chat);
    await Dal.chatRep.update(chat._id, chat);
    await Dal.userRep.update(user._id, user);
    socket.broadcast.to(chat_id).emit("addToRoom", user);
};
const removeFromRoom = async (data, io, socket, users) => {
    console.log("Token in removeFromRoom: ", data.token);
    const isValidToken = await Dal.userRep.isValidToken(data.token);
    console.log("isValidToken: ", isValidToken);
    if (isValidToken) {
        const { chat_id, user_id } = data;
        const chat = await Dal.chatRep.getById(chat_id);
        const user = await Dal.userRep.getById(user_id);
        chat.participants = chat.participants.filter((p) => p._id.toString() !== user._id.toString());
        chat.admins = chat.admins.filter((p) => p._id.toString() !== user._id.toString());
        user.chats = user.chats.filter((c) => c._id.toString() !== chat._id.toString());
        await Dal.chatRep.update(chat._id, chat);
        await Dal.userRep.update(user._id, user);
        socket.broadcast.to(chat_id).emit("removeFromRoom", { user, chat });
        const userSocket = users.get(user_id);
        userSocket?.leave(chat_id);
    }
    else {
        console.log("removeFromRoom failed: Token is invalid");
    }
};
const createChat = async (data, io, socket, users) => {
    console.log("Token in removeFromRoom: ", data.token);
    const isValidToken = await Dal.userRep.isValidToken(data.token);
    console.log("isValidToken: ", isValidToken);
    if (isValidToken) {
        const newChat = new Chat({ ...data.chat });
        await Dal.chatRep.add(newChat);
        newChat.participants.forEach(async (p) => {
            const user = await Dal.userRep.getById(p._id);
            user.chats.push(newChat);
            user.joinedDict[newChat._id.toString()] = Date.now();
            await Dal.userRep.update(user._id, user);
        });
        data.chat._id = newChat._id.toString();
        data.chat.participants.forEach(async (u) => {
            const pSocket = users.get(u._id);
            pSocket?.emit("newChat", data.chat);
        });
    }
    else {
        console.log("createChat failed: Token is invalid");
    }
};
const updateChat = async (data, io, socket, users) => {
    const isValidToken = await Dal.userRep.isValidToken(data.token);
    if (!isValidToken)
        return;
    const Chat = await Dal.chatRep.getById(data.chat._id);
    for (let i = 0; i < Chat.participants.length; i++) {
        let p = Chat.participants[i];
        if (!data.chat.participants.includes(p._id.toString())) {
            const user = await Dal.userRep.getById(p._id);
            Chat.participants = Chat.participants.filter((p) => p._id.toString() !== user._id.toString());
            Chat.admins = Chat.admins.filter((p) => p._id.toString() !== user._id.toString());
            user.chats = user.chats.filter((c) => c._id.toString() !== Chat._id.toString());
            await Dal.userRep.update(user._id, user);
            const userSocket = users.get(user._id.toString());
            userSocket?.leave(Chat._id);
            userSocket?.emit('removeFromRoom', { chat: Chat, user: user });
        }
    }
    for (let i = 0; i < data.chat.participants.length; i++) {
        let p = data.chat.participants[i];
        if (!Chat.participants.find(participant => participant._id.toString() === p)) {
            const addedParticipant = await Dal.userRep.getById(p);
            addedParticipant?.chats?.push(Chat);
            addedParticipant.joinedDict[Chat._id.toString()] = Date.now();
            Chat.participants?.push(addedParticipant);
            await Dal.userRep.update(addedParticipant._id, addedParticipant);
            const userSocket = users.get(p);
            userSocket?.join(Chat._id.toString());
        }
    }
    if (data.chat.imageUrl) {
        Chat.imageUrl = data.chat.imageUrl;
        io.emit("chatImageUpdated", { chatId: data.chat._id, newImageUrl: data.chat.imageUrl });
    }
    Chat.name = data.chat.name;
    Chat.description = data.chat.description;
    Chat.admins = data.chat.admins;
    await Dal.chatRep.update(Chat._id, Chat);
    socket.broadcast.to(data.chat._id).emit("updateChat", Chat);
};
const chatEvents = {
    functions: [
        newMessage,
        joinRoom,
        leaveRoom,
        addToRoom,
        removeFromRoom,
        createChat,
        updateChat,
    ],
    eventNames: [
        newMessageEventName,
        joinRoomEventName,
        leaveRoomEventName,
        addToRoomEventName,
        removeFromRoomEventName,
        createChatEventName,
        updateChatEventName,
    ],
};
export default chatEvents;
//# sourceMappingURL=chatio.js.map