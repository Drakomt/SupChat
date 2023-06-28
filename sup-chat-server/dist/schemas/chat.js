import mongoose, { Schema } from "mongoose";
const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date },
    imageUrl: { type: String },
});
// Define and export the model
export const Chat = mongoose.model("Chat", ChatSchema);
//# sourceMappingURL=chat.js.map