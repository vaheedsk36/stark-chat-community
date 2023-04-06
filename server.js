const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 2500 || process.env.PORT;

//set static folder
app.use(express.static(path.join(__dirname,'public')));


const botName = 'Stark Bot';
// Run when client connects
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

         // emit to the user connect
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    
    // emit to everyone when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(user.username, `A ${user.username} has joined the chat`));

    // Send users in the room
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })

    });
   
    // Listen for chatMessage

    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(`${user.username}`,msg));
    })

    // Runs when a client disconnect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
                // Send users in the room
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })
        }
    });
});

server.listen(PORT,()=>console.log(`Server running on ${PORT}`));