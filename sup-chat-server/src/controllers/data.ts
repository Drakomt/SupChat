import { Request,Response } from "express";
import path from "path";
import fs from "fs";
import { Sup } from "../repository/Sup.js";
import { Chat } from "../schemas/chat.js";
import { Message } from "../schemas/message.js";
import { User } from "../schemas/user.js";
const Dal = new Sup();

export const fetchAllUsers = async (req,res) => {
    try {
      const users = await User.find().populate('friends chats');
      res.send(JSON.stringify(users));
  
    } catch (error) {
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const findUserList = async (req, res) =>{
  try{
    const usersIds = req.body
    const users = await Dal.userRep.getManyById(usersIds);
    const usersData = users.map(user => {
      return {email:user.email,username:user.username, _id:user._id}});
    res.send(JSON.stringify(usersData));
  }
  catch(error){
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

export const fetchAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user');
    res.send(JSON.stringify(messages));

  } catch (error) {
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
      }});
    console.log('chats: ', chats, chats[0].messages)
    res.send(JSON.stringify(chats));

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const uploadChatImage = async (req: Request,res: Response) => {
  if(!req.file){
    res.status(400).json({error: 'No file uploaded'});
  }

  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if(!chat){
    res.status(404).json({error: 'Chat not found'});
  }

  // Delete the existing image file if one exists
  if(chat.imageUrl) {
    const oldImagePath = path.join(process.cwd(), "..", "..", "public", "images", "chats", path.basename(chat.imageUrl));
    fs.unlink(oldImagePath, (err) => {
      if (err) console.log(err);
    });
  }

  const imageUrl = `/images/chats/${req.file.filename}`;
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { imageUrl }, { new: true });

  if(!updatedChat){
    return res.status(404).json({error: 'Chat not found'});
  }
  
  return res.status(200).json({imageUrl});
}

