module.exports = function (http){
    var Mailgun = require('mailgun-js');
    //Your api key, from Mailgun’s Control Panel
    var api_key = 'key-bbc15e19617892298c094664b34bb489';

    //Your domain, from the Mailgun Control Panel
    var domain = 'sandbox496f36b80ba14ea78b5e29021bdacebe.mailgun.org';

        //Your sending email address
    var from_who = 'j.campos893@gmail.com';
    var enableMail = false;
    var mqttStatus = false;
    var io = require('socket.io')(http);
    var mqttSettings = require("./private/mqtt.js");
    var mqtt    = require('mqtt');
    var mqttClient;

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
              mqttClient.subscribe("home/ldr/changed");
              mqttClient.subscribe("home/lamp/status");

              mqttStatus = true;

         mqttClient.on("message", function(topic, payload) {
             if(topic === "home/ldr"){
               socket.emit("home/ldr",payload.toString());
           }
           if(topic === "home/lamp/status"){
              socket.emit("home/lamp/status",payload.toString());
           }
           if(topic === "home/ldr/changed"){
             if(enableMail){
                         //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
               var mailgun = new Mailgun({apiKey: api_key, domain: domain});

               var data = {
               //Specify email data
                 from: from_who,
               //The email to contact
                 to: from_who,
               //Subject and text data
                 subject: 'ALERTA-ALGUÉM ACENDEU A LUZ',
                 html: ' Graca foi buscar sapato, lembrar de ligar sirene<p></p><a href="http://gracahome.herokuapp.com/">Acessar webAPP</a>'
               }
               mailgun.messages().send(data, function (err, body) {
                       //If there is an error, render the error page
                       if (err) {

                           console.log("got an error: ", err);
                       }
                       //Else we can greet    and leave
                       else {
                           //Here "submitted.jade" is the view file for this landing page
                           //We pass the variable "email" from the url parameter in an object rendered by Jade

                           console.log("email sended");
                       }
                   });

           }
         }


         });




    });
    socket.on("home/lamp/toggle",function(status){
      mqttClient.publish("home/lamp/toggle",status);
    });
    socket.on("home/lamp/status",function(){
      mqttClient.publish("home/lamp/status/get");
    });
    socket.on("mailStatus",function(status){
          enableMail  = Number(status);
    });

    mqttClient.on("close",function(){
           io.emit("mqttDisconnected");
            mqttStatus = false;
        });

  });
};
