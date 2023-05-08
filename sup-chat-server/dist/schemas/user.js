import mongoose, { Schema } from 'mongoose';
// Define the schema
const UserSchema = new Schema({
    friends: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
});
// Define and export the model
export const User = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map