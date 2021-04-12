var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17" + Math.floor(Math.random() * 100));
boolean sp = false;
enum type {bigHead,head,body,bigBody,tail,noIdea};
int WIDTH = 30;
int HEIGHT = 30;
int resolut = 20;
int size = 3;
int score = 0;
public pos {
  int x = 0;
  int Y = 0;
}
public warmBody {
  pos p;
  type part = noIdea;
}
pos vHead;
vector <warmBody> warm = new vector <warmBody>;
vector <pos> miam = new vector <pos>;


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

function setLED(n,red,green,blue){
  if(n==1)
  {
    client.send('sdi17/DF:66:32:49:C8:1A/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
  else if(n==2)
  {
    client.send('sdi17/DC:06:D9:40:7A:CB/led', '{"red": ' + red + ',"green": ' + green + ',"blue": ' + blue + '}');
  }
}

function void startStop(){
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

function void reStart(){
  score = 0;
  size = 3;
  
  sp = true;
  startStop();
  
  warm.clean;
  warmBody w1 = new warmBody;
  w1.p.x = 4*resolut;
  w1.p.y = 1*resolut;
  w1.part = head;
  warm.add(w1);
  
  warmBody w2 = new warmBody;
  w2.p.x = 3*resolut;
  w2.p.y = 1*resolut;
  w2.part = body;
  warm.add(w2);
  
  warmBody w3 = new warmBody;
  w3.p.x = 3*resolut;
  w3.p.y = 1*resolut;
  w3.part = tail;
  warm.add(w3);
  
  vHead.x= resolut;
  vHead.y=0;
  
  //draw
}

function void runGame(){
  move();
  //draw
  
}

function bool checkCollision() {
  for (int y: miam){
    if(((warm.get(0).px+warm.get(0).vx) ==  miam.get(y).px) && ((warm.get(0).py+warm.get(0).vy) == miam.get(y).py)){
      score = score+1;
      warm.get(0).part=bigHead;
    }
  }
  if(((warm.get(0).px+warm.get(0).vx) || (warm.get(0).py+warm.get(0).vy))<= 0){
    retun true;
  }
  else if(((warm.get(0).px+warm.get(0).vx) >= WIDTH){
    retun true;
  }
  else if(((warm.get(0).py+warm.get(0).vy) >= HEIGHT){
    retun true;
  } 
  
  for(int x =1; x<= warmBody.size()-1;x++){
    if(((warm.get(0).px+warm.get(0).vx) ==  warm.get(x).px) && ((warm.get(0).py+warm.get(0).vy) == warm.get(y).py)){
      retun true;
    }
  }
  retun false;
}

function move(){
  if(checkCollision()){
      sp= true;
      game over;
  }else{
    //tail
    if(warm.get(size-2).part == bigBody){
      warmBody wb = new warmBody;
      wb.p.x = warm.get(size-1).p.x;
      wb.p.y = warm.get(size-1).p.y;
      wb.part = tail;
      warm.add(wb);
      size = size+1;
    }else{
      warm.get(size-1).p.x = warm.get(size-2).p.x;
      warm.get(size-1).p.y = warm.get(size-2).p.y;
    }
    
    //body
    for(int x =size-2; x> 1 ;x--){
      warm.get(x).p.x = warm.get(x-1).p.x;
      warm.get(x).p.y = warm.get(x-1).p.y;
      if(warm.get(x-1).part == BigHead){
        warm.get(x).part = bigBody; 
      }else{
        arm.get(x).part = warm.get(x-1).part
      }
    }
    
    //head
    warm.get(0).p.x = warm.get(0).p.x + vHead.x;
    warm.get(0).p.y = warm.get(0).p.y + vHead.y; 
  }
}