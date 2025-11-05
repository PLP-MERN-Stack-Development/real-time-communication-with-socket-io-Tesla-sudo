import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: String,
  sender: String,
  message: String,
  type: { type: String, default: "text" },
  file: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);