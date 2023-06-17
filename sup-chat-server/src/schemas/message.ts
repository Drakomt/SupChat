import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.js';

// Define interface for the document
export interface IMessage extends Document {
  user: IUser;
  text: string;
  dateTime: Date;
  image: string;
}

// Define the schema
const MessageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: false },
  dateTime: { type: Date, required: true },
  image: { type: String, required: false },
});

// Define and export the model
export const Message = mongoose.model<IMessage>('Message', MessageSchema);