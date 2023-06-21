import { Sup } from "../repository/Sup.js";
import { IUser, User } from "../schemas/user.js";
import { Chat } from "../schemas/chat.js";
import bcrypt from "bcrypt";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Schema } from "mongoose";
import { Request,Response } from "express";
import path from "path";
import fs from "fs";
const Dal = new Sup();

export async function signUp(request, response) {
  try {
    const saltRounds = 12;
    const { email, username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(
      "email:",
      email,
      "username:",
      username,
      "password:",
      hashedPassword
    );
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      createdAt: Date.now(),
      imageUrl: `/images/chats/${request.file?.filename}`,
      joinedDict: {}
    });
    const signUpUser = await Dal.userRep.add(newUser);
    response.sendStatus(201);
  } catch (error) {
    console.log("signUp error:", error);
    response.redirect("signUp");
  }
}

export const SECRET_KEY = "mySecretKey";

export async function getUserByToken(request, response) {
  try {
    const token = request.body.token;
    //console.log("token:", token);

    // Verify and decode the token
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user = await Dal.userRep.findById(decodedToken.userId);

    response.json({ token: token, user: user });
  } catch (error) {
    console.log("Token error: ", error);
    response.status(404).send("Token not Valid");
  }
}

export async function login(request, response) {
  try {
    const { email, password } = request.body;
    const foundUser = await Dal.userRep.findByEmail(email);
    if (foundUser) {
      const isPasswordMatch = await bcrypt.compare(
        password,
        foundUser.password
      );
      const IsValid = !(foundUser == null || !isPasswordMatch);
      if (IsValid) {
        // Generate a new token
        const newToken = jwt.sign({ userId: foundUser.id }, SECRET_KEY, {
          expiresIn: "1h",
        });

        response.json({ token: newToken, user: foundUser });
      }else {
        // response.status(404).json({ error: "Password is invalid" });
        response.status(404).send("Password is invalid");
      }
    } else {
      // response.status(404).json({ error: "Email is invalid" });
      response.status(404).send("Email is invalid");
    }
  } catch (error) {
    console.log("Login error:", error);
    response.status(500).send("Internal server error");
  }
}


export async function addContact(request, response) {
  console.log("adding a contact...");
  console.log("friends: ", request.body.user.friends);
  const updatedUserData = request.body.user;
  const updatedUser = await Dal.userRep.getById(updatedUserData._id);
  updatedUser.friends.push(updatedUserData.newFriend);
  await Dal.userRep.update(updatedUser._id, updatedUser);
  console.log("User Updated");
  response.status(202).send("user updated");
}


export async function addChat(request, response) {
  console.log("adding a Chat...");
  console.log("body:", request.body);
  const newChatData = request.body;
  const newChat = new Chat({ ...newChatData });
  await Dal.chatRep.add(newChat);

  newChatData.participants.forEach(async (pData) => {
    const user = await Dal.userRep.getById(pData._id);
    user.chats.push(newChat);
    await Dal.userRep.update(user._id, user);
  });
  response.status(202).send("chat updated");
}


export const uploadUserImage = async (req: Request,res: Response) => {
  if(!req.file){
    res.status(400).json({error: 'No file uploaded'});
  }

  const userId = req.params.id;
  const user = await User.findById(userId);
  if(!user){
    res.status(404).json({error: 'Chat not found'});
  }

  // Delete the existing image file if one exists
  if(user.imageUrl) {
    const oldImagePath = path.join(process.cwd(), "..", "..", "public", "images", "users", path.basename(user.imageUrl));
    fs.unlink(oldImagePath, (err) => {
      if (err) console.log(err);
    });
  }

  const imageUrl = `/images/users/${req.file.filename}`;
  const updatedUser = await User.findByIdAndUpdate(userId, { imageUrl }, { new: true });

  if(!updatedUser){
    return res.status(404).json({error: 'User not found'});
  }
  
  return res.status(200).json({imageUrl});
}