const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.models");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require('../services/vector.services');

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        }
    });

    // 🔐 Auth middleware
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            return next(new Error("Authentication Error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return next(new Error("Authentication Error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication Error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.user._id);
        console.log("Socket ID:", socket.id);

        // join chat room
        socket.on("join-chat", ({ chatId }) => {
            socket.join(chatId);
        });

        // leave chat room
        socket.on("leave-chat", ({ chatId }) => {
            socket.leave(chatId);
        });

        // AI message handler
        socket.on("ai-message", async (messagePayload) => {
            try {
                console.log("AI request:", messagePayload);

                if (!messagePayload.chat || !messagePayload.content?.trim()) {
                    console.log("Empty message ignored");
                    return;
                }

                socket.emit("ai-start");

                // ⚡ parallel: save user message + vector
                const [message, vectors] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: messagePayload.content,
                        role: "user"
                    }),
                    aiService.generateVector(messagePayload.content)
                ]);

                // 🧠 store memory
                await createMemory({
                    vectors,
                    messageId: message._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        text: messagePayload.content
                    }
                });

                // ⚡ parallel: memory + chat history
                const [memory, chatHistory] = await Promise.all([
                    queryMemory({
                        queryVector: vectors,
                        limit: 3,
                        metadata: {
                            user: socket.user._id
                        }
                    }),
                    messageModel.find({
                        chat: messagePayload.chat,
                    }).sort({ createdAt: -1 }).limit(20).lean()
                ]);

                // short-term memory (STM)
                const stm = chatHistory.reverse().map((item) => ({
                    role: item.role,
                    parts: [{ text: item.content }],
                }));

                // long-term memory (LTM)
                const memoryText = memory?.length
                    ? memory.map(item => item.metadata.text).join('\n')
                    : "No previous relevant memory found.";

                const ltm = [
                    {
                        role: "user",
                        parts: [{
                            text: `
These are some previous relevant memories from the chat:

${memoryText}

Use them to generate a better response.
                        `
                        }]
                    }
                ];

                // 🤖 AI response
                const response = await aiService.generateResponse([...ltm, ...stm]);

                console.log("AI response generated");

                socket.emit("ai-response", {
                    content: response,
                    chat: messagePayload.chat
                });

                // ⚡ save AI response + vector
                const [responseMessage, responseVector] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: response,
                        role: "model"
                    }),
                    aiService.generateVector(response)
                ]);

                // 🧠 store AI memory
                await createMemory({
                    vectors: responseVector,
                    messageId: responseMessage._id,
                    metadata: {
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        text: response
                    }
                });

            } catch (error) {
                console.error("AI socket error:", error);
                socket.emit("ai-error", {
                    message: "Something went wrong while generating AI response"
                });
            }
        });
    });
}

module.exports = initSocketServer;