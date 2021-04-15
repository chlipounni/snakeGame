var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17" + Math.floor(Math.random() * 100));
const thingies1 = 'DF:66:32:49:C8:1A';
const thingies2 = 'DC:06:D9:40:7A:CB';

const  type =  {BIGHEAD : 'bigHead',HEAD :'head',BODY:'body',BIGBODY:'bigBody',TAIL:'tail',NOIDEA:'noidea'};

class pos {
   constructor() {
       let x ;
       let y ;
   }
}

//param game
const WIDTH = 300;
const HEIGHT = 300;
const resolut = 10;
var size = 3;
var score = 0;
var timeM = 500; // 2 deplacement pour 1s
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
var sp = false;

class warmBody {
    constructor() {
        let p = new pos(0, 0);
        let part = type.NOIDEA;
    }
}
var vHead;
var warmVec = [];
var miamVec = [];

//image game
var bigHead;
var head;
var bigBody;
var body;
var tail;
var miam;
var background;
var gameOver;

//canvas
var gw = document.getElementById('GameWindow');
var ctx = gw.getContext('2d');
gw.width = WIDTH;
gw.height = HEIGHT;

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
  keepAliveInterval: 30,
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
    client.send('sdi12/'+thingies2+'/led', JSON.stringify({
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

function startStop(){
	if(sp === true ){
	//pause game
  sp = false;
  setLED(1,0,0,255);
  setLED(2,0,0,255);
  //stopTimer
  
	}else{
	//restart game
  sp = true;
  setLED(1,255,0,0);
  setLED(2,0,255,0);
  //starttimer;
  runGame();
	}
}

function reStart(){
  score = 0;
  size = 3;
  timeM = 500;
  
  sp = true;	//pour passer en Mode pause apres
  startStop();
  
  //warm
  warmVec.clean;
  let w1 = new warmBody();
  w1.p.x = 4*resolut;
  w1.p.y = resolut;
  w1.part = head;
  warmVec.add(w1);
  
  var w2 = new warmBody;
  w2.p.x = 3 * resolut;
  w2.p.y = resolut;
  w2.part = body;
  warmVec.add(w2);
  
  var w3 = new warmBody;
  w3.p.x = 3 * resolut;
  w3.p.y = resolut;
  w3.part = tail;
  warmVec.add(w3);
  
  vHead.x= resolut;
  vHead.y=0;
  
  //miam
  miamVec.clean;
  addMiam();
  
  drawGame();
}

function runGame(){
  if(sp === true){
	setTimeout(runGame(),time);
	move();
  }
  drawGame();
}

function checkCollision(){
  for (var i=0;i<= warmVec.size-1;i++){
    if(((warmVec.get(0).p.x+vHead.x) ===  miamVec.get(y).x) && ((warmVec.get(0).p.y+vHead.y) === miamVec.get(y).y)){
      score = score+1;
	  addMiam();
      warmVec.get(0).part=bigHead;
    }
  }
  
  if(((warmVec.get(0).p.x + vHead.x) || (warmVec.get(0).p.y + vHead.y))<= 0){
    return true;
  }
  else if((warmVec.get(0).p.x+vHead.x) >= WIDTH){
    return true;
  }
  
  else if((warmVec.get(0).p.y+vHead.y) >= HEIGHT){
    return true;
  }
  
  for(var x =1; x<= warmVec.size-1;x++){
    if(((warmVec.get(0).p.x+vHead.x) ===  warmVec.get(x).p.x) && ((warmVec.get(0).p.y+vHead.y) === warmVec.get(y).p.y)){
      return 1;
    }
  }
  return false;
}

function move(){
  if(checkCollision()){
      sp= true;
      //game over;
	  drawGameOver();
  }else{
    //tail
    if(warmVec.get(size-2).part === type.BIGBODY){
      let wb = new warmBody();
      wb.p.x = warmVec.get(size-1).p.x;
      wb.p.y = warmVec.get(size-1).p.y;
      wb.part = tail;
      warmVec.add(wb);
      size = size+1;
    }else{
      warmVec.get(size-1).p.x = warmVec.get(size-2).p.x;
      warmVec.get(size-1).p.y = warmVec.get(size-2).p.y;
    }
    
    //body
    for(let x =size-2; x> 1 ;x--){
      warmVec.get(x).p.x = warmVec.get(x-1).p.x;
      warmVec.get(x).p.y = warmVec.get(x-1).p.y;
      if(warmVec.get(x-1).part === type.BIGHEAD){
        warmVec.get(x).part = bigBody;
      }else{
        warmVec.get(x).part = warmVec.get(x-1).part
      }
    }
    
    //head
    warmVec.get(0).p.x = warmVec.get(0).p.x + vHead.x;
    warmVec.get(0).p.y = warmVec.get(0).p.y + vHead.y;
  }
}

function turnL(){
	if(vHead.x  > 0){
		vHead.x = 0;
		vHead.y = -resolut;
	}else if(vHead.y < 0){
		vHead.y = 0;
		vHead.x = -resolut;
	}else if(vHead.x < 0){
		vHead.x = 0;
		vHead.y = resolut;
	}else if(vHead.y > 0){
		vHead.y = 0;
		vHead.x = resolut;
	}	
}

function turnR(){
	if(vHead.x > 0){
		vHead.x = 0;
		vHead.y = resolut;
	}else if(vHead.y > 0){
		vHead.y = 0;
		vHead.x = -resolut;
	}else if(vHead.x < 0){
		vHead.x = 0;
		vHead.y = -resolut;
	}else if(vHead.y < 0){
		vHead.y = 0;
		vHead.x = resolut;
	}
}

function addMiam(){
	let x = 0;
	let y = 0;
	let ok = true;
	
	do{
		ok = true;
		x = Math.random() * (WIDTH/resolut);
		y = Math.random() * (HEIGHT/resolut);
		
		for(let i =1; x<= warmVec.size;x++){
			if((warmVec.get(i).p.x ===  x) || (warmVec.get(i).p.y === y)){
				ok = false;
			}
		}
		
		for(let i =1; i <= miamVec.size;i++){
			if((miamVec.get(i).x ===  x) || (miamVec.get(i).y === y)){
				ok = false;
			}
		}
	}while(!ok);
	
	let m = new pos;
	m.x = x;
	m.y= y;
	miam.add(m);
}

function drawGame(){

	ctx.drawImage(background, 0, 0);
  
	for(let i =1; i <= warmVec.size;i++){
		switch (warmVec.get(i).type){
            case 'bigHead':
			 ctx.drawImage(bigHead, warmVec.get(i).p.x, warmVec.get(i).p.y);
			 break;
			case head:
			 ctx.drawImage(head, warmVec.get(i).p.x, warmVec.get(i).p.y);
			 break;
			 case bigBody:
			 ctx.drawImage(bigBody, warmVec.get(i).p.x, warmVec.get(i).p.y);
			 break;
			 case body:
			 ctx.drawImage(body, warmVec.get(i).p.x, warmVec.get(i).p.y);
			 break;
			 case tail:
			 ctx.drawImage(tail, warmVec.get(i).p.x, warmVec.get(i).p.y);
			 break;
			 default:
			 break;
		}
	}
	for(var i =1; i <= miamVec.size;i++){
		ctx.drawImage(miam, miamVec.get(i).x, miamVec.get(i).y);
	}
}

function drawGameOver (){
	ctx.drawImage(background, 0, 0,WIDTH,HEIGHT,null);
	ctx.drawImage(gameOver, (WIDTH/2)-gameOver.width, (HEIGHT/2)-gameOver.height);
	
}

document.onload = function (){
    bigHead =   document.getElementById("bigHead");
    head    =   document.getElementById("head");
    bigBody =   document.getElementById("bigBody");
    body    =   document.getElementById("body");
    tail    =   document.getElementById("tail");
    miam    =   document.getElementById("miam");
    background = document.getElementById("background");
    gameOver =  document.getElementById("gameOver");

    drawGame();
}