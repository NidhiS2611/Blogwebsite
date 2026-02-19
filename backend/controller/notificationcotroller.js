// GET /api/notifications
const Notification = require('../models/notificationmodel');

const  getMyNotifications = async (req, res) => {
  const userid = req.user.id;
  console.log("User ID from auth middleware:", userid);
  try {
    const notifications = await Notification.find({
      receiver:userid   // 🔥 MAIN POINT
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name profilepicture"); // Populate sender details
 console.log(notifications);
 
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
    console.log(err);
    
  }
};
 const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 const markAllAsRead = async (req, res) => {
  try {
    const userid = req.user.id;
    await Notification.updateMany(
      { receiver: userid, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "All notifications read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: userId, // 🔐 ownership check
    });

    if (!deletedNotification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.status(200).json({ msg: "Notification deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

 module.exports = { getMyNotifications, getUnreadCount, markAllAsRead, deleteNotification };