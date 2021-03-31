var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi12" + Math.floor(Math.random() * 100));

client.onConnectionLost = function(responseObject)
{
  if (responseObject.errorCode !== 0)
  {
    console.error("Lost connection:" + responseObject.errorMessage);
  }
  else
  {
    console.log("Connection closed.");
  }
}

client.onMessageArrived = function(message)
{
  var logTA = document.getElementById('log');
  var splittedName = message.destinationName.split('/');
  
  switch(splittedName[1])
  {
    case 'status':
      var obj = JSON.parse(message.payloadString);
      logTA.textContent += 'New status:' + '\n'
                        + obj.connected=='true'?'Connected':'Disconnected' + '\n'
                        + 'Thingies connected: ' + obj.thingies.length + '\n';
      break;
    case 'D2:E7:C3:EC:E1:72':
      logTA.textContent += 'Button of Thingy 1: ' + ((message.payloadString=="true")?'pressed':'released') + '\n';
      break;
    case 'E3:6E:24:6D:0A:7F':
      logTA.textContent += 'Button of Thingy 2: ' + ((message.payloadString=="true")?'pressed':'released') + '\n';
      break;
    default:
      console.log("Got message: topic=" + message.destinationName + ', payload=' + message.payloadString);
      break;
  }
}

client.connect({
  userName: 'sdi12',
  password: 'b853639e6c7631559460361e47fced98',
  keepAliveInterval: 30,
  cleanSession: true,
  onSuccess: function() {
    console.log("Connected.");
    client.subscribe("sdi12/status");
    client.subscribe("sdi12/+/button");
    client.send('sdi12/D2:E7:C3:EC:E1:72/led', JSON.stringify({
      red: 0,
      green: 0,
      blue: 255
    }));
    client.send('sdi12/E3:6E:24:6D:0A:7F/led', JSON.stringify({
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
  var red = document.getElementById('red').value;
  var green = document.getElementById('green').value;
  var blue = document.getElementById('blue').value;
  if(n==1)
  {
    client.send('sdi12/D2:E7:C3:EC:E1:72/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
  else if(n==2)
  {
    client.send('sdi12/E3:6E:24:6D:0A:7F/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
}