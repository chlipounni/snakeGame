const  type =  {BIGHEAD : 'bigHead',HEAD :'head',BODY:'body',BIGBODY:'bigBody',TAIL:'tail',NOIDEA:'noidea'};
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
var timeM = 500; // 2 deplacement pour 1s
var t;
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
var sp = false;
var gameOv = false;

var vHead = new pos(0,0);
var warmVec = [];
var miamVec = [];

//image game
var bigHead = document.getElementById("bigHead");
var head = document.getElementById("head");
var bigBody = document.getElementById("bigBody");
var body = document.getElementById("body");
var tail = document.getElementById("tail");
var miam = document.getElementById("miam");
var gameOver = document.getElementById("gameOver");
var background = document.getElementById("background");

var canvas = document.getElementById('GameWindow');
var ctx = canvas.getContext('2d');

function startStop(){
    if(sp === true ){
        //pause game
        clearTimeout(t);
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
    gameOv = false;
    startStop();

    //warm
    warmVec = [];
    warmVec.push({posX:4*resolut,posY:2*resolut,part:'head',ang:2 });
    warmVec.push({posX:3*resolut,posY:2*resolut,part:'body',ang:2 });
    warmVec.push({posX:2*resolut,posY:2*resolut,part:'tail',ang:2 });

    vHead.x= resolut;
    vHead.y=0;

    //miam
    miamVec = [];
    addMiam();

    drawGame();
}

function runGame(){
    if(sp){
        t = setTimeout(runGame,timeM);
        move();
        drawGame();
    }else{
       clearTimeout(t);
    }
}

function checkCollision(){
    if(warmVec.size !== 0) {
        for (var i = 0; i < warmVec.size - 1; i++) {
            if (miamVec.size !== 0) {
                if (((warmVec[0].posX + vHead.x) === miamVec[y].x) && ((warmVec[0].posY + vHead.y) === miamVec[y].y)) {
                    score = score + 1;
                    addMiam();
                    warmVec[0].part = bigHead;
                }
            }
        }

        if (((warmVec[0].posX + vHead.x) || (warmVec[0].posY + vHead.y)) <= resolut) {
            return true;
        } else if ((warmVec[0].posX + vHead.x) >= WIDTH-resolut) {
            return true;
        } else if ((warmVec[0].posY + vHead.y) >= HEIGHT-resolut) {
            return true;
        }

        for (var x = 0; x < warmVec.size - 1; x++) {
            if (((warmVec[0].posX + vHead.x) === warmVec[x].posX) && ((warmVec[0].posY + vHead.y) === warmVec[x].posY)) {
                return 1;
            }
        }
    }
    return false;
}

function move(){
    if(checkCollision()){
        sp= false;
        gameOv =true;
        //game over
    }else{
        //tail
        if(warmVec[size-2].part === type.BIGBODY){
            warmVec.add({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:tail,angle:warmVec[size-1].angle});
            size = size+1;
        }else{
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
        }

        //body
        for(let x = size - 2 ; x > 0 ;x--){
            warmVec[x].posX = warmVec[x-1].posX;
            warmVec[x].posY = warmVec[x-1].posY;
            warmVec[x].ang = warmVec[x-1].ang;
            if(warmVec[x-1].part === 'bigHead'){
                warmVec[x].part = 'bigBody';
            }else if(warmVec[x-1].part === 'head'){
                warmVec[x].part = 'body';
            }else{
                warmVec[x].part = warmVec[x-1].part
            }
        }

        //head
        warmVec[0].posX = warmVec[0].posX + vHead.x;
        warmVec[0].posY = warmVec[0].posY + vHead.y;
    }
}

function turnR(){
    if(vHead.x  > 0){
        vHead.x = 0;
        vHead.y = -resolut;
        warmVec[0].ang = 3;
    }else if(vHead.y < 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec[0].ang = 2;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec[0].ang = 1;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = resolut;
        warmVec[0].ang = 0;
    }
}

function turnL(){
    if(vHead.x > 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec[0].ang = 1;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec[0].ang = 2;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = -resolut;
        warmVec[0].ang = 3;
    }else if(vHead.y < 0){
        vHead.y = 0;
        vHead.x = resolut;
        warmVec.get(0).ang = 0;
    }
}

function addMiam(){
    let x = 0;
    let y = 0;
    let ok = true;

    do{
        ok = true;
        x =Math.floor(Math.random() * ((WIDTH/resolut)-4))*resolut;
        y = Math.floor(Math.random() * ((HEIGHT/resolut)-4))*resolut;

        for(let i =0; x< warmVec.size;x++){
            if((warmVec.get(i).posX ===  x) || (warmVec.get(i).posY=== y)){
                ok = false;
            }
        }

        for(let i =0; i < miamVec.size;i++){
            if((miamVec.get(i).x ===  x) || (miamVec.get(i).y === y)){
                ok = false;
            }
        }
    }while(!ok);

    let m = new pos(0,0);
    m.x = x;
    m.y= y;
    miamVec.push(m);
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
}

function drawRotatedImage ( image , x , y , angle )  {
    ctx. save ( ) ;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -(image.width/2), -(image.height/2));
    ctx.restore();
}