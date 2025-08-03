const http = require('http');
const socketIo = require('socket.io');
const app = require('./src/app');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('doctor-status-change', (data) => {
    io.emit('doctor-status-updated', data);
  });
  
  socket.on('session-update', (data) => {
    io.emit('session-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});