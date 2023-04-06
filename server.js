const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 2500 || process.env.PORT;

//set static folder
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
io.on('connection',socket=>{
    console.log('New WS Connection');
});

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));