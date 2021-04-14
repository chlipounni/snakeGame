var client = new Paho.MQTT.Client("mqtt-ws.sdi.hevs.ch", 80, "/ws", "sdi17" + Math.floor(Math.random() * 100));
String thingies1 = 'DF:66:32:49:C8:1A';
string thingies2 = 'DC:06:D9:40:7A:CB';



enum type {bigHead,head,body,bigBody,tail,noIdea};

public pos {
  int x = 0;
  int Y = 0;
}

//param game
{
int WIDTH = 300;
int HEIGHT = 300;
int resolut = 10;
int size = 3;
int score = 0;
int timeM = 500; // 2 deplacement pour 1s
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
boolean sp = false;
}

public warmBody {
  pos p;
  type part = noIdea;
}
pos vHead;
vector <warmBody> warm = new vector <warmBody>;
vector <pos> miam = new vector <pos>;

//image game
{
var bigHead = new Image();
var head = new Image();
var bigBody = new Image();
var body = new Image();
var tail = new Image();
var miam = new Image();		 
var background = new Image();
var gameOver = new Image();
}

//canvas
var gw = document.getElementById('GameWindow');
var ctx = gw.getContext('2d');
gw.width = WIDTH;
gw.height = HEIGHT;

preload();
drawGame();


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
                        + obj.connected=='true'?'Connected':'Disconnected' + '\n'
                        + 'Thingies connected: ' + obj.thingies.length + '\n';
      break;
    case thingies1:
		if(message.payloadString=="true"){
			turnL();
		}
	  break;
    case thingies2:
		if(message.payloadString=="true"){
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

function void setLED(n,red,green,blue){
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

function void reStart(){
  score = 0;
  size = 3;
  timeM = 500;
  
  sp = true;	//pour passer en Mode pause apres
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
  
  miam.clean;
  addMiam();
  
  drawGame();
}

function void runGame(){
  if(sp == true){
	setTimeOut(runGame(),time);
	move();
  }
  drawGame();
}

function boolean checkCollision(){
  for (int y: miam){
    if(((warm.get(0).p.x+vHead.x) ==  miam.get(y).x) && ((warm.get(0).p.y+vHead.y) == miam.get(y).y)){
      score = score+1;
	  addMiam();
      warm.get(0).part=bigHead;
    }
  }
  
  if(((warm.get(0).px + vHead.x) || (warm.get(0).py + vHead.y))<= 0){
    retun true;
  }
  else if((warm.get(0).px+vHead.x) >= WIDTH){
    retun true;
  }
  
  else if((warm.get(0).py+vHead.y) >= HEIGHT){
    retun true;
  }
  
  for(int x =1; x<= warmBody.size()-1;x++){
    if(((warm.get(0).p.x+vHead.x) ==  warm.get(x).p.x) && ((warm.get(0).p.y+vHead.y) == warm.get(y).p.y)){
      retun true;
    }
  }
  retun false;
}

function void move(){
  if(checkCollision()){
      sp= true;
      //game over;
	  drawGameOver();
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

function void turnL{
	if(vHead.x == resolut){
		vHead.x = 0;
		vHead.y = -resolut;
	}else if(vHead.y == -resolut){
		vHead.y = 0;
		vHead.x = -resolut;
	}else if(vHead.x == -resolut){
		vHead.x = 0;
		vHead.y = resolut;
	}else if(vHead.y == resolut){
		vHead.y = 0;
		vHead.x = resolut;
	}	
}

function void turnR{
	if(vHead.x == resolut){
		vHead.x = 0;
		vHead.y = resolut;
	}else if(vHead.y == resolut){
		vHead.y = 0;
		vHead.x = -resolut;
	}else if(vHead.x == -resolut){
		vHead.x = 0;
		vHead.y = -resolut;
	}else if(vHead.y == -resolut){
		vHead.y = 0;
		vHead.x = resolut;
	}
}

function void addMiam(){
	int x = 0;
	int y = 0;
	boolean ok = true;
	
	do{
		ok = true;
		x = Math.random() * (WIDTH/resolut);
		y = Math.random() * (HEIGHT/resolut);
		
		for(int x =1; x<= warmBody.size();x++){
			if((warm.get(x).p.x ==  x) || (warm.get(x).p.y == y)){
				ok = false;
			}
		}
		
		for(int i =1; i <= miam.size();i++){
			if((miam.get(i).x ==  x) || (miam.get(i).y == y)){
				ok = false;
			}
		}
	}while(!ok);
	
	pos m = new pos;
	m.x = x;
	m.y= y;
	miam.add(m);
}

function void drawGame(){
	for(warm wb:warmBody){
		switch (wb.type){
			case bigHead:
			 ctx.drawImage(bigHead, wb.p.x, wb.p.y);
			 break;
			case head:
			 ctx.drawImage(head, wb.p.x, wb.p.y);
			 break;
			 case bigBody:
			 ctx.drawImage(bigBody, wb.p.x, wb.p.y);
			 break;
			 case body:
			 ctx.drawImage(body, wb.p.x, wb.p.y);
			 break;
			 case tail:
			 ctx.drawImage(tail, wb.p.x, wb.p.y);
			 break;
			 default:
			 break;
		}
	}
	for(miam m:pos){
		ctx.drawImage(miam, m.x, m.y);
	}
}

function void drawGameOver (){
	ctx.drawImage(gameOver, (WIDTH/2)-gameOver.width, (HEIGHT/2)-gameOver.height);
	
}
function preload() {
	bigHead.src = '../../images/bigHead.jpg';
	head.src = '../../images/head.jpg';
	bigBody.src = '../../images/bigBody.jpg';
	body.src = '../../images/body.jpg';
	tail.src = '../../images/tail.jpg';
	miam.src = '../../images/miam.jpg';
	background.src = '../../images/background.jpg';
	gameOver.src = '../../images/gameOver.jpg';
	
	ctx.drawImage(background, 0, 0,WIDTH,HEIGHT,null);
}