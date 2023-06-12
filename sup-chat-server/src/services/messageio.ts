//seen and sent message

import { Server, Socket } from "socket.io";

const seenEventName: String = "seen";
const sentEventName: String = "sent";
const typingEventName: String = "typing";
const stoppedTypingEventName: String = "stopped typing";

const typingUsersMap = new Map();

async function seen() {}

async function sent() {}

function typing(data: any,io: Server, socket: Socket) {
    const {chatId, userId} = data;
    console.log('Server received typing event', {chatId, userId}, 'from socket: ',socket.id); 
    let typingUsers = typingUsersMap.get(chatId) || new Set();
    typingUsers.add(userId);
    typingUsersMap.set(chatId, typingUsers);
    socket.to(chatId).emit("typing", {userId, chatId});
}

function stoppedTyping(data: any,io: Server, socket: Socket) {
    const {chatId, userId} = data;
    console.log('Server received stopped typing event', {chatId, userId});
    let typingUsers = typingUsersMap.get(chatId) || new Set();
    typingUsers.delete(userId);
    if(typingUsers.size === 0) {
        typingUsersMap.delete(chatId);
    } else {
        typingUsersMap.set(chatId, typingUsers);
    }
    socket.to(chatId).emit("stopped typing", {userId, chatId});
}

const messageEvents = {functions:[seen, sent, typing, stoppedTyping],
    eventNames: [seenEventName, sentEventName, typingEventName, stoppedTypingEventName]};   
  
export default messageEvents;