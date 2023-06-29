import mongoose, { Schema, Document } from 'mongoose';
import { IChat } from './chat.js';
import { IMessage } from './message.js';
import { Dictionary } from 'express-serve-static-core';

// Define interface for the document
export interface IUser extends Document {
  friends: IUser[];
  chats: IChat[];
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  createdAt:{type:Date},
  joinedDict:{type:Object}
}

// Define the schema
const UserSchema: Schema = new Schema({
  friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: true } ],
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat', required: true } ],
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imageUrl: {type: String},
  createdAt:{type:Date},
  joinedDict:{type:Object, required: true}
});

// Define and export the model
export const User = mongoose.model<IUser>('User', UserSchema);
