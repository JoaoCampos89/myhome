var socket = io();
var app = {};
app.connected = false;
socket.on('connect',function(){
   socket.emit('test', 'Hello server');
 });


//events checking if mqtt is connected
socket.on("mqttConnected", function(){
  app.connected = true;
  document.getElementById("mqtt").innerHTML = "Connected";
});
socket.on("mqttDisconnected", function(){
  app.connected = false;
  document.getElementById("mqtt").innerHTML = "Disconnected";
});

// toggle lamp in room
function toggleLamp(){
  if(app.connected){
    var lamp = document.getElementById("lamp");
        // Todo client can modify the html
        if(lamp.innerHTML =="ON"){
         var  status = 0;
         socket.emit("home/lamp/toggle", status.toString());
        }else if (lamp.innerHTML =="OFF") {
          var status = 1;
          socket.emit("home/lamp/toggle", status.toString());
        }{
        }
    }
}
function enableMail(){
  if(app.connected){
    var enableMail = document.getElementById("enablemail");
        // Todo client can modify the html
        var  status = 0;
        if(enableMail.innerHTML == "ON"){
         status = 0;
         enableMail.innerHTML = "OFF";
         enableMail.className = "btn btn-danger btn-lg";
         socket.emit("mailStatus", status.toString());
        }else if (enableMail.innerHTML =="OFF") {
          status = 1;
          enableMail.innerHTML = "ON";
          enableMail.className = "btn btn-success btn-lg";
          socket.emit("mailStatus", status.toString());
        }
    }
}



socket.on("home/lamp/status",function(status){
  var lamp = document.getElementById('lamp');
  var status = Number(status);
  if(status){
      lamp.innerHTML = "ON";
      lamp.className = "btn btn-success btn-lg btn-block";
  }else {
      lamp.innerHTML = "OFF";
      lamp.className = "btn btn-danger btn-lg btn-block"
    }
});

socket.on("home/ldr",function(payload){
  var ldr = document.getElementById('ldr');
  ldr.innerHTML = payload;
});
