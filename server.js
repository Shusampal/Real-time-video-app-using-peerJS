const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4 : uuid }= require('uuid');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

 
app.use(express.static('public'));

app.get('/',(req,res)=>{


    res.redirect(`/${uuid()}`);

})

app.get('/:room',(req,res)=>{

    res.render('room',{roomId:req.params.room});
    
})


io.on('connection',(socket)=>{
    socket.on('join-room',(roomId , userid)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userid);

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userid);
        })

        
    })

    
})

 





server.listen(process.env.PORT || 8000,()=>{
    console.log("listening to port 8000");
})