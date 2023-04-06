const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 2500 || process.env.PORT;

//set static folder
app.use(express.static(path.join(__dirname,'public')));


const botName = 'Chat Cord Bot';
// Run when client connects
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{

         // emit to the user connect
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    
    // emit to everyone when a user connects
    socket.broadcast.emit('message',formatMessage(botName, 'A user has joined the chat'));


    });
   
    // Runs when a client disconnect
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

    // Listen for chatMessage

    socket.on('chatMessage',msg=>{
        io.emit('message',formatMessage('USER',msg));
    })
});

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));