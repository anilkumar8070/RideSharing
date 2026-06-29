const socketio = require('socket.io');
const Message = require('../models/Message');

const initializeSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: '*', // For dev mode, accept all origins
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`New WebSocket connection: ${socket.id}`);

        socket.on('joinRoom', async ({ roomId }) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
            
            // Fetch past messages and send them to the user
            try {
                const pastMessages = await Message.find({ chatId: roomId }).sort({ createdAt: 1 });
                socket.emit('messageHistory', pastMessages);
            } catch (err) {
                console.error('Error fetching message history:', err);
            }
        });

        socket.on('chatMessage', async (data) => {
            const { roomId, senderId, senderName, text } = data;

            try {
                // Save msg to MongoDB
                const message = await Message.create({
                    chatId: roomId,
                    senderId,
                    senderName,
                    text
                });

                // Broadcast to everyone in the room (including sender)
                io.to(roomId).emit('message', message);
            } catch (err) {
                console.error('Error saving socket message:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;
