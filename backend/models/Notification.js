import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
  message: String,
  details: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  link: String,
});
const notificationSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notifications: [notificationsSchema],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
