//typeBody =  {'bigHead','head','body','bigBody','tail','bigTail','noidea'};
class pos {
    constructor() {
        let x ;
        let y ;
    }
}

//param game
var size = 3;
var score = 0;
var scoreMax =0;
var timeM = 500;
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
var bigBodyL = document.getElementById("bigBodyL");
var bigBodyR= document.getElementById("bigBodyR");
var body = document.getElementById("body");
var bodyL = document.getElementById("bodyL");
var bodyR = document.getElementById("bodyR");
var tail = document.getElementById("tail");
var tailL = document.getElementById("tailL");
var tailR = document.getElementById("tailR");
var bigTail = document.getElementById("bigTail");
var bigTailL = document.getElementById("bigTailL");
var bigTailR= document.getElementById("bigTailR");
var miam = document.getElementById("miam");
var gameOver = document.getElementById("gameOver");
var background = document.getElementById("background");
var pause = document.getElementById("pause");

//size canvas game
var bgH = 14;
var bgW = 23;
const resolut = 80;
const WIDTH = bgW*resolut; //1840
const HEIGHT = bgH*resolut; //1120

var canvas = document.getElementById('GameWindow');
canvas.height = HEIGHT;
canvas.width= WIDTH;
var ctx = canvas.getContext('2d');

scoreMax= localStorage.getItem('localMaxScore');

function startStop(){
    if(!gameOv){
        if(sp === true ){
            //pause game
            clearTimeout(t);
            sp = false;
            setLED(1,0,0,255);
            setLED(2,0,0,255);
            drawImage(pause, (WIDTH/2),(HEIGHT/2),0);
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
    warmVec.push({posX:4*resolut,posY:2*resolut,part:'head',ang:2 });
    warmVec.push({posX:3*resolut,posY:2*resolut,part:'body',ang:2 });
    warmVec.push({posX:2*resolut,posY:2*resolut,part:'tail',ang:2 });

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
        } else if ((warmVec[0].posX + vHead.x) >= WIDTH) {
            return true;
        } else if ((warmVec[0].posY + vHead.y) >= HEIGHT) {
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
        theEnd();
    }else{
        //tail
        if(warmVec[size-1].part === 'bigTail'){
            warmVec.push({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:'tail',ang:warmVec[size-1].ang});
            size = size+1;
        }else if(warmVec[size-1].part === 'bigTailR'){
            warmVec.push({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:'tailR',ang:warmVec[size-1].ang});
            size = size+1;
        }else if(warmVec[size-1].part === 'bigTailL'){
            warmVec.push({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:'tailL',ang:warmVec[size-1].ang});
            size = size+1;
        }else if(warmVec[size-2].part === 'bigBody'){
            warmVec[size-1].part = 'bigTail';
            warmVec[size-2].part = 'body';
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
        }else if(warmVec[size-2].part === 'bigBodyL') {
            warmVec[size - 1].part = 'bigTailL';
            warmVec[size - 2].part = 'body';
            warmVec[size - 1].posX = warmVec[size - 2].posX;
            warmVec[size - 1].posY = warmVec[size - 2].posY;
            warmVec[size - 1].ang = warmVec[size - 2].ang;
        }else if(warmVec[size-2].part === 'bigBodyR'){
            warmVec[size-1].part = 'bigTailR';
            warmVec[size-2].part = 'body';
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
        }else if(warmVec[size-2].part === 'bodyL'){
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
            warmVec[size-1].part='tailL';
        }else if(warmVec[size-2].part === 'bodyR'){
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
            warmVec[size-1].part='tailR';
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

        //first body
            if(warmVec[x-1].part === 'head'){
                warmVec[x].part = 'body';
            }else if(warmVec[x-1].part === 'headL'){
                warmVec[x].part = 'bodyL';
            }else if(warmVec[x-1].part === 'headR'){
                warmVec[x].part = 'bodyR';
            }else if(warmVec[x-1].part === 'bigHead'){
                warmVec[x].part = 'bigBody';
            }else if(warmVec[x-1].part === 'bigHeadL'){
                warmVec[x].part = 'bigBodyL';
            }else if(warmVec[x-1].part === 'bigHeadR'){
                warmVec[x].part = 'bigBodyR';
            }else{
                warmVec[x].part = warmVec[x-1].part
            }

        }

        //head
        warmVec[0].posX = warmVec[0].posX + vHead.x;
        warmVec[0].posY = warmVec[0].posY + vHead.y;

        if (eatMiam){
            eatMiam=false;
            warmVec[0].part = 'bigHead';
        }else{
            warmVec[0].part = 'head';
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
    if(warmVec[0].part=== 'bigHead'){
        warmVec[0].part='bigHeadL';
    }else{
        warmVec[0].part='headL';
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
    if(warmVec[0].part=== 'bigHead'){
        warmVec[0].part='bigHeadR';
    }else{
        warmVec[0].part='headR';
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

    ctx.drawImage(background,0,0,WIDTH,HEIGHT);

    for(let i =0; i < warmVec.length;i++){
        switch (warmVec[i].part){
            case 'bigHead':
            case 'bigHeadL':
            case 'bigHeadR':
                drawRotatedImage(bigHead, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'head':
            case 'headL':
            case 'headR':
                drawRotatedImage(head, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigBody':
                drawRotatedImage(bigBody, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigBodyL':
                drawRotatedImage(bigBodyL, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigBodyR':
                drawRotatedImage(bigBodyR, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'body':
                drawRotatedImage(body, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bodyL':
                drawRotatedImage(bodyL, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bodyR':
                drawRotatedImage(bodyR, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'tail':
                drawRotatedImage(tail, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'tailL':
                drawRotatedImage(tailL, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'tailR':
                drawRotatedImage(tailR, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigTail':
                drawRotatedImage(bigTail, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigTailL':
                drawRotatedImage(bigTailL, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            case 'bigTailR':
                drawRotatedImage(bigTailR, warmVec[i].posX, warmVec[i].posY,(Math.PI/2)*warmVec[i].ang);
                break;
            default:
                break;
        }
    }
    for(var i =0; i < miamVec.length;i++){
        drawRotatedImage(miam, miamVec[i].x, miamVec[i].y,0);
    }
    if(gameOv){
        drawImage(gameOver, (WIDTH/2), (HEIGHT/2),0);
    }

    document.getElementById('score').textContent = ('score : '+score + '\t max Score : '+scoreMax);
}

function drawRotatedImage ( image , x , y , angle )  {
    ctx. save ( ) ;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -(image.height/2), -(image.width/2),resolut,resolut);
    ctx.restore();
}
function drawImage ( image , x , y , angle )  {
    ctx. save ( ) ;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -(image.height/2), -(image.width/2));
    ctx.restore();
}
function upVitesse(){
    time=time-20;
}

function theEnd(){
    setLED(1,0,0,0);
    setLED(2,0,0,0);
    sp= false;
    gameOv =true;
    //game over
    if(scoreMax < score){
        localStorage.setItem('localMaxScore', score);
        scoreMax = score;
    }
}


