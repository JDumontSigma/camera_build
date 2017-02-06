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



var currentblur = 0;
var currentDB = 0;
//start of every users connection
//function(socket) = each users socket connection
io.sockets.on('connection',function(socket){
  //data is recieivng message from box
  // socket.on('room request', function(data){
  //   socket.broadcast.emit('room response', data);
  // });

  socket.on('colour blind change', function(data){
    socket.broadcast.emit('cb change',data);

  });

  socket.on('blur eye choice',function(data){
    var option = data.option;
    socket.broadcast.emit('eye blur',{choice:option});
  });

  socket.on('blur level',function(data){
    var level = data.level;

    if(level !== currentblur){
      socket.broadcast.emit('new blur',{number:level})
      currentblur = level;
    }

  });

  socket.on('db level',function(data){
    var level = data.level;

    if(level !== currentDB){
      var number;
      if(level === 20){
        number = 0;
      }
      if(level === 40){
        number = 1;
      }
      if(level === 60){
        number = 2;
      }
      if(level === 80){
        number = 3;
      }
      if(level === 100){
        number =40;
      }
      socket.broadcast.emit('new db',{number:number});
      currentDB = level;
    }

  });




});
