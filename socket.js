module.exports = function (http){
    var mqttStatus = false;
    var io = require('socket.io')(http);
    var mqttSettings = require("./private/mqtt.js");
    var mqtt    = require('mqtt');


    var url = "mqtt://"+ mqttSettings.user+ ":" +mqttSettings.password + "@" + mqttSettings.server + ":" +mqttSettings.port;
io.on('connection', function(socket){
      if(mqttStatus){
        socket.emit("mqttConnected");
        mqttClient.publish("home/ldr/get");
      }else{
        socket.emit("mqttDisconnected");
      }



    mqttClient = mqtt.connect(url); // you add a ws:// url here
    mqttClient.on("connect",function(){
  
              socket.emit("mqttConnected");
              mqttClient.subscribe("home/ldr");
              mqttClient.subscribe("home/lamp/status");
              mqttStatus = true;

         mqttClient.on("message", function(topic, payload) {
             if(topic === "home/ldr"){
               socket.emit("home/ldr",payload.toString());
           }
           if(topic === "home/lamp/status"){
              socket.emit("home/lamp/status",payload.toString());
           }
         });




    });
    socket.on("home/lamp/toggle",function(status){
      mqttClient.publish("home/lamp/toggle",status);
    });
    socket.on("home/lamp/status",function(){
      mqttClient.publish("home/lamp/status/get");
    });


    mqttClient.on("close",function(){
           io.emit("mqttDisconnected");
            mqttStatus = false;
        });

  });
};
