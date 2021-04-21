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
var sp = false;
var gameOv = false;
var eatMiam = false;

var vHead = new pos(0,0);
//partBody =  {'bigHead','head','body','bigBody','tail','bigTail','noidea'};
//snakeBody =  {posX:,posY:,part:,ang: }
var snakeVec = [];
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
const bgH = 14;
const bgW = 23;
const resolut = 80;
const WIDTH = bgW*resolut; //1840
const HEIGHT = bgH*resolut; //1120

var canvas = document.getElementById('GameWindow');
canvas.height = HEIGHT;
canvas.width= WIDTH;
var ctx = canvas.getContext('2d');

function startStop(){
    if(!gameOv){
        if(sp === true ){
            //pause game
            document.getElementById('bpSP').textContent="START";
            clearTimeout(t);
            sp = false;
            drawImage(pause, (WIDTH/2),(HEIGHT/2),0);
            //stopTimer

        }else{
            document.getElementById('bpSP').textContent="PAUSE";
            //restart game
            sp = true;
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

    //snake
    snakeVec = [];
    snakeVec.push({posX:4*resolut,posY:2*resolut,part:'head',ang:2 });
    snakeVec.push({posX:3*resolut,posY:2*resolut,part:'body',ang:2 });
    snakeVec.push({posX:2*resolut,posY:2*resolut,part:'tail',ang:2 });

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
    if(snakeVec.length !== 0) {

        if (((snakeVec[0].posX + vHead.x) < resolut) || ((snakeVec[0].posY + vHead.y) < resolut)) {
            ret= true;
        } else if ((snakeVec[0].posX + vHead.x) >= WIDTH) {
            return true;
        } else if ((snakeVec[0].posY + vHead.y) >= HEIGHT) {
            ret= true;
        }

        for (var x = 1; x < snakeVec.length; x++) {
            if (((snakeVec[0].posX + vHead.x) === snakeVec[x].posX) && ((snakeVec[0].posY + vHead.y) === snakeVec[x].posY)) {
                ret= true;
            }
        }

        if (miamVec.length !== 0) {
            for (var i = 0; i < miamVec.length; i++) {
                if (((snakeVec[0].posX + vHead.x) === miamVec[i].x) && ((snakeVec[0].posY + vHead.y) === miamVec[i].y)) {
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
    }
    else{
        //tail
        if(snakeVec[size-1].part === 'bigTail'){
            snakeVec.push({posX:snakeVec[size-1].posX,posY:snakeVec[size-1].posY,part:'tail',ang:snakeVec[size-1].ang});
            size = size+1;
        }else if(snakeVec[size-1].part === 'bigTailR'){
            snakeVec.push({posX:snakeVec[size-1].posX,posY:snakeVec[size-1].posY,part:'tailR',ang:snakeVec[size-1].ang});
            size = size+1;
        }else if(snakeVec[size-1].part === 'bigTailL'){
            snakeVec.push({posX:snakeVec[size-1].posX,posY:snakeVec[size-1].posY,part:'tailL',ang:snakeVec[size-1].ang});
            size = size+1;
        }else if(snakeVec[size-2].part === 'bigBody'){
            snakeVec[size-1].part = 'bigTail';
            snakeVec[size-2].part = 'body';
            snakeVec[size-1].posX = snakeVec[size-2].posX;
            snakeVec[size-1].posY = snakeVec[size-2].posY;
            snakeVec[size-1].ang = snakeVec[size-2].ang;
        }else if(snakeVec[size-2].part === 'bigBodyL') {
            snakeVec[size - 1].part = 'bigTailL';
            snakeVec[size - 2].part = 'body';
            snakeVec[size - 1].posX = snakeVec[size - 2].posX;
            snakeVec[size - 1].posY = snakeVec[size - 2].posY;
            snakeVec[size - 1].ang = snakeVec[size - 2].ang;
        }else if(snakeVec[size-2].part === 'bigBodyR'){
            snakeVec[size-1].part = 'bigTailR';
            snakeVec[size-2].part = 'body';
            snakeVec[size-1].posX = snakeVec[size-2].posX;
            snakeVec[size-1].posY = snakeVec[size-2].posY;
            snakeVec[size-1].ang = snakeVec[size-2].ang;
        }else if(snakeVec[size-2].part === 'bodyL'){
            snakeVec[size-1].posX = snakeVec[size-2].posX;
            snakeVec[size-1].posY = snakeVec[size-2].posY;
            snakeVec[size-1].ang = snakeVec[size-2].ang;
            snakeVec[size-1].part='tailL';
        }else if(snakeVec[size-2].part === 'bodyR'){
            snakeVec[size-1].posX = snakeVec[size-2].posX;
            snakeVec[size-1].posY = snakeVec[size-2].posY;
            snakeVec[size-1].ang = snakeVec[size-2].ang;
            snakeVec[size-1].part='tailR';
        }else{
            snakeVec[size-1].posX = snakeVec[size-2].posX;
            snakeVec[size-1].posY = snakeVec[size-2].posY;
            snakeVec[size-1].ang = snakeVec[size-2].ang;
            snakeVec[size-1].part='tail';
        }

        //body
        for(let x = size - 2 ; x > 0 ;x--){
            snakeVec[x].posX = snakeVec[x-1].posX;
            snakeVec[x].posY = snakeVec[x-1].posY;
            snakeVec[x].ang = snakeVec[x-1].ang;

        //first body
            if(snakeVec[x-1].part === 'head'){
                snakeVec[x].part = 'body';
            }else if(snakeVec[x-1].part === 'headL'){
                snakeVec[x].part = 'bodyL';
            }else if(snakeVec[x-1].part === 'headR'){
                snakeVec[x].part = 'bodyR';
            }else if(snakeVec[x-1].part === 'bigHead'){
                snakeVec[x].part = 'bigBody';
            }else if(snakeVec[x-1].part === 'bigHeadL'){
                snakeVec[x].part = 'bigBodyL';
            }else if(snakeVec[x-1].part === 'bigHeadR'){
                snakeVec[x].part = 'bigBodyR';
            }else{
                snakeVec[x].part = snakeVec[x-1].part
            }
        }

        //head
        snakeVec[0].posX = snakeVec[0].posX + vHead.x;
        snakeVec[0].posY = snakeVec[0].posY + vHead.y;

        //eat?
        if (eatMiam){
            eatMiam=false;
            snakeVec[0].part = 'bigHead';
        }else{
            snakeVec[0].part = 'head';
        }
    }
}

function turnL(){
    if(sp){
        if(vHead.x  > 0){
            vHead.x = 0;
            vHead.y = -resolut;
            snakeVec[0].ang = 1;
        }else if(vHead.y < 0){
            vHead.y = 0;
            vHead.x = -resolut;
            snakeVec[0].ang = 0;
        }else if(vHead.x < 0){
            vHead.x = 0;
            vHead.y = resolut;
            snakeVec[0].ang = 3;
        }else if(vHead.y > 0){
            vHead.y = 0;
            vHead.x = resolut;
            snakeVec[0].ang = 2;
        }
        if(snakeVec[0].part=== 'bigHead'){
            snakeVec[0].part='bigHeadL';
        }else{
            snakeVec[0].part='headL';
        }
    }
}

function turnR(){
    if(sp) {
        if (vHead.x > 0) {
            vHead.x = 0;
            vHead.y = resolut;
            snakeVec[0].ang = 3;
        } else if (vHead.y > 0) {
            vHead.y = 0;
            vHead.x = -resolut;
            snakeVec[0].ang = 0;
        } else if (vHead.x < 0) {
            vHead.x = 0;
            vHead.y = -resolut;
            snakeVec[0].ang = 1;
        } else if (vHead.y < 0) {
            vHead.y = 0;
            vHead.x = resolut;
            snakeVec[0].ang = 2;
        }
        if (snakeVec[0].part === 'bigHead') {
            snakeVec[0].part = 'bigHeadR';
        } else {
            snakeVec[0].part = 'headR';
        }
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

        for(let i =0; x< snakeVec.length;x++){
            if((snakeVec[i].posX ===  x) || (snakeVec[i].posY=== y)){
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

    for(let i =0; i < snakeVec.length;i++){
        switch (snakeVec[i].part){
            case 'bigHead':
            case 'bigHeadL':
            case 'bigHeadR':
                drawRotatedImage(bigHead, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'head':
            case 'headL':
            case 'headR':
                drawRotatedImage(head, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigBody':
                drawRotatedImage(bigBody, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigBodyL':
                drawRotatedImage(bigBodyL, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigBodyR':
                drawRotatedImage(bigBodyR, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'body':
                drawRotatedImage(body, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bodyL':
                drawRotatedImage(bodyL, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bodyR':
                drawRotatedImage(bodyR, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'tail':
                drawRotatedImage(tail, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'tailL':
                drawRotatedImage(tailL, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'tailR':
                drawRotatedImage(tailR, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigTail':
                drawRotatedImage(bigTail, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigTailL':
                drawRotatedImage(bigTailL, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
                break;
            case 'bigTailR':
                drawRotatedImage(bigTailR, snakeVec[i].posX, snakeVec[i].posY,(Math.PI/2)*snakeVec[i].ang);
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
    if(time >= 50){
        time=time-20;
    }
}

function theEnd(){
    sp= false;
    gameOv =true;
    //game over
    if(scoreMax < score){
        localStorage.setItem('localMaxScore', score);
        scoreMax = score;
    }
}