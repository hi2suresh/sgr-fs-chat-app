import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
export const getUsersForSidebar = async (req, res) => {
  // This function will handle the logic to get users for the sidebar
  try {
    const loggedInUserId = req.user.id; // Get the logged-in user's ID from the request
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getMessages = async (req, res) => {
  // This function will handle the logic to get messages for a specific user
  try {
    const userToChatId = req.params.id; // Get the user ID from the request parameters
    const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, recipient: userToChatId },
        { sender: userToChatId, recipient: loggedInUserId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};
export const sendMessage = async (req, res) => {
  // This function will handle the logic to send a message
  try {
    const { text, image } = req.body; // Get text and image from the request body
    const senderId = req.user._id; // Get the logged-in user's ID from the request
    const recipientId = req.params.id; // Get the recipient's user ID from the request parameters
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: 'Message content cannot be empty' });
    }
    let imageUrl;
    if (image) {
      // If an image is provided, upload it and get the URL
      // Assuming you have a function to handle image uploads
      imageUrl = await cloudinary.uploader.upload(image, {
        folder: 'chat-app',
      });
    }
    const newMessage = new Message({
      senderId,
      recipientId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    // Todo: Emit the new message to the recipient
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};
