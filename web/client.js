var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17");
const thingies1 = 'DF:66:32:49:C8:1A';
const thingies2 = 'DC:06:D9:40:7A:CB';

client.onConnectionLost = function(responseObject){
  if (responseObject.errorCode !== 0)
  {
    console.error("Lost connection:" + responseObject.errorMessage);
  }
  else
  {
    console.log("Connection closed.");
  }
}

client.onMessageArrived = function(message){
  var logTA = document.getElementById('log');
  var splittedName = message.destinationName.split('/');
  
  switch(splittedName[1])
  {
    case 'status':
      var obj = JSON.parse(message.payloadString);
      logTA.textContent += 'New status:' + '\n'
                        + obj.connected==='true'?'Connected':'Disconnected' + '\n'
                        + 'Thingies connected: ' + obj.thingies.length + '\n';
      break;
    case thingies1:
		if(message.payloadString==="true"){
			turnL();
		}
	  break;
    case thingies2:
		if(message.payloadString==="true"){
			turnR();
		}
      break;
    default:
      console.log("Got message: topic=" + message.destinationName + ', payload=' + message.payloadString);
      break;
  }
}

client.connect({
  userName: 'sdi17',
  password: 'edc0ebb0d524ebfe491b473111b35939',
  keepAliveInterval: 1200,
  cleanSession: true,
  onSuccess: function() {
    console.log("Connected.");
    client.subscribe("sdi17/status");
    client.subscribe("sdi17/+/button");
    client.send('sdi17/'+ thingies1+'/led', JSON.stringify({
      red: 0,
      green: 255,
      blue: 0
    }));
    client.send('sdi17/'+thingies2+'/led', JSON.stringify({
      red: 255,
      green: 0,
      blue: 0
    }));
  },
  onFailure: function() {
    console.error("Failed to connect.");
  }
});

function setLED(n,red,green,blue){
  if(n===1)
  {
    client.send('sdi17/DF:66:32:49:C8:1A/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
  else if(n===2)
  {
    client.send('sdi17/DC:06:D9:40:7A:CB/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
}