const client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17" + Math.floor(Math.random() * 100));
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
		 logTA.textContent += 'Button of Thingy 1: ' + ((message.payloadString==="true")?'pressed':'released') + '\n';
	  break;
    case thingies2:
		 logTA.textContent += 'Button of Thingy 2: ' + ((message.payloadString==="true")?'pressed':'released') + '\n';
      break;
    default:
      console.log("Got message: topic=" + message.destinationName + ', payload=' + message.payloadString);
      break;
  }
}

client.connect({
  userName: 'sdi17',
  password: 'edc0ebb0d524ebfe491b473111b35939',
  keepAliveInterval: 30,
  cleanSession: true,
  useSSL: true,
  onSuccess: function() {
    console.log("Connected.");
    client.subscribe("sdi17/status");
    client.subscribe("sdi17/+/button");
    client.send('sdi17/DF:66:32:49:C8:1A/led', JSON.stringify({
      red: 0,
      green: 255,
      blue: 0
    }));
    client.send('sdi17/DC:06:D9:40:7A:CB/led', JSON.stringify({
      red: 255,
      green: 0,
      blue: 0
    }));
  },
  onFailure: function() {
    console.error("Failed to connect.");
  }
});

function setLED(n)
{
  var redC = document.getElementById('red').value;
  var greenC = document.getElementById('green').value;
  var blueC = document.getElementById('blue').value;
  if(n==1)
  {
    client.send('sdi17/DF:66:32:49:C8:1A/led', ('{"red": ' + redC + ',"green": ' + greenC + ',"blue": ' + blueC + '}'));
  }
  else if(n==2)
  {
    client.send('sdi17/DC:06:D9:40:7A:CB/led', ('{"red": ' + redC + ',"green": ' + greenC + ',"blue": ' + blueC + '}'));
  }
}