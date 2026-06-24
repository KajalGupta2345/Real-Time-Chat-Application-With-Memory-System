const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');

async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        const chat = await chatModel.create({
            user: user._id,
            title: title.trim(),
            normalizedTitle: title.trim().toLowerCase(),
        });

        res.status(201).json({
            message: "chat created successfully!",
            chat: {
                _id: chat._id,
                title: chat.title,
                user: chat.user,
                lastActivity: chat.lastActivity,
            }
        });
    } catch (error) {
        // Mongo ka duplicate-key error code — matlab unique index ne ek
        // already-existing {user, normalizedTitle} ko reject kar diya
        if (error.code === 11000) {
            return res.status(409).json({ message: "You already have a chat with this name" });
        }
        res.status(500).json({ message: error.message });
    }
}

async function getChat(req, res) {
    try {
        const user = req.user;

        const chats = await chatModel.find({
            user: user._id
        });

        res.status(200).json({
            message: "chat retrieved successfully!",
            chats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteChat(req, res) {
    try {
        const chatId = req.params.id;

        await messageModel.deleteMany({ chat: chatId });

        const chat = await chatModel.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({
            message: "chat deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function renameChat(req, res) {
    try {
        const chatId = req.params.id;
        const { title } = req.body;

        const chat = await chatModel.findByIdAndUpdate(
            chatId,
            {
                title: title.trim(),
                normalizedTitle: title.trim().toLowerCase(),
            },
            { new: true, runValidators: true }
        );

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({
            message: "Rename chat successfully!",
            chat,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "You already have a chat with this name" });
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createChat, getChat, deleteChat, renameChat
}