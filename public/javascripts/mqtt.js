var request = new XMLHttpRequest();
// global mqtt client
  var mqttClient;


// connects to cloud mqtt server
function mqttHome(settings){
  var server = {};
  var options = {};
  options.host = settings.server;
  options.port = settings.port;
  options.user = settings.user;
  options.password = settings.password;
  options.protocol = "mqtt";
  var url = "wss://"+options.user+":"+options.password+"@"+options.host+":"+options.port;



console.log(url);


mqttClient = mqtt.connect(url); // you add a ws:// url here
     mqttClient.on("connect",function(){
          console.log("connected");
          mqttClient.status = true;
          mqttClient.subscribe("home/ldr");
          mqttClient.subscribe("home/lamp/status");
          document.querySelector("#mqtt").innerHTML = "Connected";
        })
     mqttClient.on("close",function(){
          mqttClient.status = false;
          document.querySelector("#mqtt").innerHTML = "Disconnected";
        })




     mqttClient.on("message", function(topic, payload) {
         if(topic === "home/ldr"){
           console.log("arrived payload home ldr");
           var ldr = document.querySelector('#ldr');
           ldr.innerHTML = payload;
       }
       if(topic === "home/lamp/status"){
         var lamp = document.querySelector('#lamp');

         var status = Number(payload);
           if(status){
             lamp.innerHTML = "ON";
           }else {
             lamp.innerHTML = "OFF"
           }
       }
     });

}

// toggle lamp in room
function toggleLamp(){
  if(mqttClient.status){
    var lamp = document.querySelector('#lamp');
    // Todo client can modify the html
    mqttClient.publish("lamp/toggle", lamp.innerHTML);
}
}




request.open('GET', '/mqttsettings', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var settings = JSON.parse(request.responseText);
    console.log(settings);
    mqttHome(settings);
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();
