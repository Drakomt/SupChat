import mongoose, { Schema } from 'mongoose';
// Define the schema
const MessageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: false },
    dateTime: { type: Date, required: true },
    image: { type: String, required: false },
});
// Define and export the model
export const Message = mongoose.model('Message', MessageSchema);
//# sourceMappingURL=message.js.map