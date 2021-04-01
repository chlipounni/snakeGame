var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17" + Math.floor(Math.random() * 100));
boolean sp = false;

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
    case 'DF:66:32:49:C8:1A':
      logTA.textContent += 'Button of Thingy 1: ' + ((message.payloadString=="true")?'pressed':'released') + '\n';
      break;
    case 'DC:06:D9:40:7A:CB':
      logTA.textContent += 'Button of Thingy 2: ' + ((message.payloadString=="true")?'pressed':'released') + '\n';
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
  onSuccess: function() {
    console.log("Connected.");
    client.subscribe("sdi17/status");
    client.subscribe("sdi17/+/button");
    client.send('sdi17/DF:66:32:49:C8:1A/led', JSON.stringify({
      red: 0,
      green: 255,
      blue: 0
    }));
    client.send('sdi12/DC:06:D9:40:7A:CB/led', JSON.stringify({
      red: 255,
      green: 0,
      blue: 0
    }));
  },
  onFailure: function() {
    console.error("Failed to connect.");
  }
});

function setLED(n,red,green,blue)
{
  if(n==1)
  {
    client.send('sdi17/DF:66:32:49:C8:1A/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
  else if(n==2)
  {
    client.send('sdi17/DC:06:D9:40:7A:CB/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
}

function startStop(){
	if(sp == true ){
	//pause game
  sp = false;
  setLED(1,0,0,255);
  setLED(2,0,0,255);
  //stoptimer;
	}else{
	//restart game
  sp = true;
  setLED(1,255,0,0);
  setLED(2,0,255,0);
  //starttimer;
	}
}

function reStart(){
  //restart game
}

function runGame(){
  //check collision
  //move
  
}

function checkCollision {
  
}

function move(){
  
}