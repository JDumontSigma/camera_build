'use strict';

var compression = require('compression');
var express = require('express');//include express

var app = express();//create an instance of express
app.use(compression());

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


server.listen(3000);
var device = require('express-device');

var bodyParser = require('body-parser');


var nicknames = {};
//set the files within the public folder to static
//this means they can be used as external files

app.use(express.static('public'));

app.set('view options', { layout: true });

app.set('views','./src/views');

app.set('view engine','ejs');

app.use(bodyParser());
app.use(device.capture());

device.enableDeviceHelpers(app);
device.enableViewRouting(app);


app.get('/', function(request, response) {
    response.render('splash');
});
app.get('/secret/spot', function(request, response) {
    response.render('index');
});



app.use(function (req, res) {
  res.status(404).render('404', {error:'Sorry can\'t find that! Would you like to Please search something different'});
});

app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(500).render('500');
});




//start of every users connection
//function(socket) = each users socket connection
io.sockets.on('connection',function(socket){
  //data is recieivng message from box
  // socket.on('room request', function(data){
  //   socket.broadcast.emit('room response', data);
  // });

  socket.on('colour blind change', function(data){
    socket.broadcast.emit('cb change',data);
    //socket.broadcast.emit
    //this sends it to everyone but myself
  });

  socket.on('new phone', function(data){
    var date = new Date();
    var currentTime = date.getTime();
    socket.broadcast.emit('phone count',{time:currentTime,message:data});
  });

  socket.on('new desktop', function(data){
    var date = new Date();
    var currentTime = date.getTime();
    socket.broadcast.emit('desktop count',{time:currentTime,message:data});
  });

  // socket.on('disconnect', function(data){
  //   //if no sockt nickname dont do anything
  //   if(!socket.nickname) return;
  //
  //   nicknames.splice(nicknames.indexOf(socket.nickname),1);
  //   io.sockets.emit('usernames',nicknames);
  // });




    socket.on('new user', function(data, callback){
      if(nicknames.indexOf(data) !== -1){
        callback(false);
      }else{
        callback(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        io.sockets.emit('usernames', nicknames);
      }
    });


    socket.on('disconnect', function(data){
      //if no sockt nickname dont do anything
      if(!socket.nickname) return;

      nicknames.splice(nicknames.indexOf(socket.nickname),1);
      io.sockets.emit('usernames',nicknames);
    });


});
