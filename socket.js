module.exports = function (http){
    var mqttStatus = false;
    var io = require('socket.io')(http);
    var mqttSettings = require("./private/mqtt.js");
    var mqtt    = require('mqtt');


    var url = "mqtt://"+ mqttSettings.user+ ":" +mqttSettings.password + "@" + mqttSettings.server + ":" +mqttSettings.port;
    io.on('connection', function(socket){
      if(mqttStatus){
        io.emit("mqttConnected");
        mqttClient.publish("home/ldr/get");
      }else{
        io.emit("mqttDisconnected");
      }

    });

    mqttClient = mqtt.connect(url); // you add a ws:// url here
    mqttClient.on("connect",function(){
              console.log("connected");
              io.emit("mqttConnected");
              mqttClient.subscribe("home/ldr");
              mqttClient.subscribe("home/lamp/status");
              mqttStatus = true;

         mqttClient.on("message", function(topic, payload) {
             if(topic === "home/ldr"){
               console.log( payload);
               io.emit("home/ldr",payload.toString());
           }
           if(topic === "home/lamp/status"){
              io.emit("home/lamp/status",payload);
           }
         });

         io.on("home/lamp/toggle",function(status){
           console.log("lamp toggle");
           mqttClient.publish("home/lamp/toggle",status);
         });
         io.on("home/lamp/status",function(){
           mqttClient.publish("home/lamp/status/get");
         });


    });


    mqttClient.on("close",function(){
           io.emit("mqttDisconnected");
            mqttStatus = false;
        });
}
