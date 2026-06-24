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
            origin: "http://localhost:5173",
            credentials: true,
        }
    });
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || " ");

        if (!cookies.token) {
            next(new Error("Authentication Error : No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication Error : Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("user connected", socket.user);
        console.log("New socket connection", socket.id);

        socket.on("join-chat", ({ chatId }) => {
            socket.join(chatId);
        });

        socket.on("leave-chat", ({ chatId }) => {
            socket.leave(chatId);
        });
        socket.on("ai-message", async (messagePayload) => {
            console.log("AI request : ", messagePayload);
            if (!messagePayload.chat || !messagePayload.content || !messagePayload.content.trim()) {
                console.log("Empty content received, skipping save");
                return;
            }
            socket.emit("ai-start");


            /* const message = await messageModel.create({
                 chat: messagePayload.chat,
                 user: socket.user._id,
                 content: messagePayload.content,
                 role: "user"
             });
 
             const vectors = await aiService.generateVector(messagePayload.content);*/

            const [message, vectors] = await Promise.all([
                await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                }),
                await aiService.generateVector(messagePayload.content)
            ]);

            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            });
            /* const memory = await queryMemory({
                queryVector: vectors,
                limit: 3,
                metadata: {
                    user: socket.user_id
                }
            });
            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat,
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse(); */

            const [memory, chatHistory] = await Promise.all([
                await queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),
                (await messageModel.find({
                    chat: messagePayload.chat,
                }).sort({ createdAt: -1 }).limit(20).lean()).reverse()
            ]);

            const stm = chatHistory.map((item) => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }],
                }
            });
            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `
                             these are some previous messages from the chat , use them to generate response.

                             ${memory.map(item => item.metadata.text).join('\n')}
                        `}]
                }
            ]
            // console.log(ltm[0]);
            // console.log(stm);

            const response = await aiService.generateResponse([...ltm, ...stm])
            console.log("AI response", response);

            socket.emit("ai-response", {
                content: response,
                chat: messagePayload.chat
            });


            /* const responseMessage = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            });

            const responseVector = await aiService.generateVector(response);*/
            const [responseMessage, responseVector] = await Promise.all([
                await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                }),
                await aiService.generateVector(response)
            ]);

            await createMemory({
                vectors: responseVector,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                },
            })

        });

    });
}

module.exports = initSocketServer;