import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.js";
import { IMessage } from "./message.js";

// Define interface for the document
export interface IChat extends Document {
  participants: IUser[];
  messages: IMessage[];
  admins: IUser[];
  name: string;
  description: string;
  createdAt:{type:Date},
  imageUrl: string;
}

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  name: { type: String, required: true },
  description: { type: String },
  createdAt:{type:Date},
  imageUrl: {type: String},
});


// Define and export the model
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);