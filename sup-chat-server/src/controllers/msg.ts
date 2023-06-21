import { Request,Response } from "express";
import fs from "fs";
import path from "path";
import { Sup } from "../repository/Sup.js";
import { User } from "../schemas/user.js";
import { Chat } from "../schemas/chat.js";
import { Message } from "../schemas/message.js";
const Dal = new Sup()

export async function addMessage(request, response) {
  console.log('adding a message...');
  const newMessageData = request.body;
  console.log( "newMessageData:",request.body);
  const newMessage = new Message({
    text: newMessageData.text,
    dateTime: newMessageData.dateTime,
    user: newMessageData.user._id
    });
  await Dal.messageRep.add(newMessage);

  console.log("New Message Data:", newMessageData);
  const Chat = await Dal.chatRep.getById(newMessageData.chat._id);
  Chat.messages.push(newMessage);
  Dal.chatRep.update(Chat._id, Chat);
  
  response.status(201).send('message sent to server');
}

export const uploadMessageImage = async (req: Request,res: Response) => {
  if(!req.file){
    res.status(400).json({error: 'No file uploaded'});
  }
  const newMessageData = req.body;
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if(!chat){
    res.status(404).json({error: 'Chat not found'});
  }

  const imageUrl = `/images/messages/${req.file.filename}`;
  const newMessage = new Message({
    text: "",
    image: imageUrl,
    dateTime: Date.now(),
    user: newMessageData.user,
  })
  console.log("server datetime: ",newMessage.dateTime)
  const savedMessage = await newMessage.save();
  chat.messages.push(savedMessage._id);
  await chat.save();
  
  return res.status(200).json({message: savedMessage});
};