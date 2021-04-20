//typeBody =  {'bigHead','head','body','bigBody','tail','bigTail','noidea'};
class pos {
    constructor() {
        let x ;
        let y ;
    }
}

//param game
const WIDTH = 1800;
const HEIGHT = 1100;
const resolut = 80;
var size = 3;
var score = 0;
var timeM = 250;
var time;
var t;
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
var sp = false;
var gameOv = false;
var eatMiam = false;

var vHead = new pos(0,0);
var warmVec = [];
var miamVec = [];

//image game
var bigHead = document.getElementById("bigHead");
var head = document.getElementById("head");
var bigBody = document.getElementById("bigBody");
var body = document.getElementById("body");
var tail = document.getElementById("tail");
var bigTail = document.getElementById("bigTail");
var miam = document.getElementById("miam");
var gameOver = document.getElementById("gameOver");
var background = document.getElementById("background");
var pause = document.getElementById("pause");

var canvas = document.getElementById('GameWindow');
var ctx = canvas.getContext('2d');



function startStop(){
    if(sp === true ){
        //pause game
        clearTimeout(t);
        sp = false;
        setLED(1,0,0,255);
        setLED(2,0,0,255);
        drawRotatedImage(pause, (WIDTH/2),(HEIGHT/2),0);
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
    time = timeM;

    sp = true;	//pour passer en Mode pause apres
    gameOv = false;
    startStop();

    //warm
    warmVec = [];
    warmVec.push({posX:4*head.height,posY:2*head.width,part:'head',ang:2 });
    warmVec.push({posX:3*body.height,posY:2*body.width,part:'body',ang:2 });
    warmVec.push({posX:2*tail.height,posY:2*tail.width,part:'tail',ang:2 });

    vHead.x= resolut;
    vHead.y=0;

    //miam
    miamVec = [];
    miamVec.push({x:0,y:0})
    addMiam(0);

    drawGame();
}

function runGame(){
    if(sp){
        t = setTimeout(runGame,time);
        move();
        drawGame();
    }else{
       clearTimeout(t);
    }
}

function checkCollision(){
    let ret = false;
    if(warmVec.size !== 0) {

        if (((warmVec[0].posX + vHead.x) < resolut) || ((warmVec[0].posY + vHead.y) < resolut)) {
            ret= true;
        } else if ((warmVec[0].posX + vHead.x) >= WIDTH - resolut) {
            return true;
        } else if ((warmVec[0].posY + vHead.y) >= HEIGHT - resolut) {
            ret= true;
        }

        for (var x = 1; x < warmVec.length; x++) {
            if (((warmVec[0].posX + vHead.x) === warmVec[x].posX) && ((warmVec[0].posY + vHead.y) === warmVec[x].posY)) {
                ret= true;
            }
        }

        if (miamVec.size !== 0) {
            for (var i = 0; i < miamVec.length; i++) {
                if (((warmVec[0].posX + vHead.x) === miamVec[i].x) && ((warmVec[0].posY + vHead.y) === miamVec[i].y)) {
                    score = score + 1;
                    if(score%2==0){
                        upVitesse();}
                    addMiam(i);
                   eatMiam = true;
                }
            }
        }
    }
    return ret;
}

function move(){
    if(checkCollision()){
        sp= false;
        gameOv =true;
        //game over
    }else{
        //tail
        if(warmVec[size-1].part === 'bigTail'){
            warmVec.push({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:'tail',ang:warmVec[size-1].ang});
            size = size+1;
        }else if(warmVec[size-2].part === 'bigBody'){
            warmVec[size-1].part = 'bigTail';
            warmVec[size-2].part = 'body';
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
        }else{
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
            warmVec[size-1].part='tail';
        }

        //body
        for(let x = size - 2 ; x > 0 ;x--){
            warmVec[x].posX = warmVec[x-1].posX;
            warmVec[x].posY = warmVec[x-1].posY;
            warmVec[x].ang = warmVec[x-1].ang;
            if(warmVec[x-1].part === 'head'){
                warmVec[x].part = 'body';
            }else if(warmVec[x-1].part === 'bigHead'){
                warmVec[x].part = 'bigBody';
            }else{
                warmVec[x].part = warmVec[x-1].part
            }

        }

        //head
        warmVec[0].posX = warmVec[0].posX + vHead.x;
        warmVec[0].posY = warmVec[0].posY + vHead.y;
        if(warmVec[0].part === 'bigHead'){
            warmVec[0].part = 'head';
        }
        if (eatMiam){
            eatMiam=false;
            warmVec[0].part = 'bigHead';
        }
    }
}

function turnL(){
    if(vHead.x  > 0){
        vHead.x = 0;
        vHead.y = -resolut;
        warmVec[0].ang = 1;
    }else if(vHead.y < 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec[0].ang = 0;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec[0].ang = 3;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = resolut;
        warmVec[0].ang = 2;
    }
}

function turnR(){
    if(vHead.x > 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec[0].ang = 3;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec[0].ang = 0;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = -resolut;
        warmVec[0].ang = 1;
    }else if(vHead.y < 0){
        vHead.y = 0;
        vHead.x = resolut;
        warmVec[0].ang = 2;
    }
}

function addMiam(miamPos){
    let x = 0;
    let y = 0;
    let ok = true;
    do{
        ok = true;
        x =Math.floor(Math.random() * ((WIDTH/resolut)-4))*resolut+resolut;
        y = Math.floor(Math.random() * ((HEIGHT/resolut)-4))*resolut+resolut;

        for(let i =0; x< warmVec.length;x++){
            if((warmVec[i].posX ===  x) || (warmVec[i].posY=== y)){
                ok = false;
            }
        }

        for(let i =0; i < miamVec.length;i++){
            if((miamVec[i].x ===  x) || (miamVec[i].y === y)){
                ok = false;
            }
        }
    }while(!ok);

    miamVec[miamPos].x = x;
    miamVec[miamPos].y = y;
}

function drawGame(){

    ctx.drawImage(background,0,0);

    for(let i =0; i < warmVec.length;i++){
        switch (warmVec[i].part){
            case 'bigHead':
                drawRotatedImage(bigHead, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'head':
                drawRotatedImage(head, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigBody':
                drawRotatedImage(bigBody, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'body':
                drawRotatedImage(body, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'tail':
                drawRotatedImage(tail, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigTail':
                drawRotatedImage(bigTail, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            default:
                break;
        }
    }
    for(var i =0; i < miamVec.length;i++){
        drawRotatedImage(miam, miamVec[i].x, miamVec[i].y,0);
    }
    if(gameOv){
        drawRotatedImage(gameOver, (WIDTH/2), (HEIGHT/2),0);
    }

    document.getElementById('score').textContent = 'score : '+score;
}

function drawRotatedImage ( image , x , y , angle )  {
    ctx. save ( ) ;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -(image.height/2), -(image.width/2));
    ctx.restore();
}

function upVitesse(){
    time=time-20;
}