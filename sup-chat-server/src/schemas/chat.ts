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
}

/* // Define the schema
const ChatSchema: Schema = new Schema({
  participants: [{ participant: { type: Object, required: true } }],
  messages: [{ message: { type: Object, required: true } }],
  admins: [{ type: Object, required: true }],
  name: { type: String, required: true },
  description: { type: String },
},{ toJSON: { virtuals: true } }); */

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  name: { type: String, required: true },
  description: { type: String },
  createdAt:{type:Date}
});


// Define and export the model
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);