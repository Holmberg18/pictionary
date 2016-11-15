var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var lastGuesser = '';

var clients = {
        // instantiate empty object
}

io.on('connection', function (socket) {
        
        clients[socket.id]= socket.id;
        console.log(clients);
        console.log(Object.keys(clients).length);
         if(Object.keys(clients).length == 1){
               socket.emit("drawer", true);  
         }
         else{
                 socket.emit("drawer", false);
         }
     
     
     
     
        socket.on("draw", function(position){
             io.sockets.emit("draw",position);
        });

        socket.on("guess", function(guess){
                lastGuesser = socket.id;
                // console.log("a guess was made");
                socket.broadcast.emit('guess', guess);     
        });
        
        socket.on("disconnect",function(){
        
                delete clients[socket.id];  
        
});
        socket.on('correct-answer', function(correctAnswer){
            
            io.sockets.emit('answer',correctAnswer);
            io.sockets.to(lastGuesser).emit('drawer',true);
            socket.emit('drawer',false)
            
        });
        
        
    
    });
    


server.listen(process.env.PORT || 8080);