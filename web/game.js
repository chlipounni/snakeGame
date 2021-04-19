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
const resolut = 10;
var size = 3;
var score = 0;
var timeM = 500; // 2 deplacement pour 1s
var t;
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
var sp = false;

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
    startStop();

    //warm
    warmVec = [];
    warmVec.push({posX:4*resolut,posY:resolut,part:'head',ang:0 });
    warmVec.push({posX:3*resolut,posY:resolut,part:'body',ang:0 });
    warmVec.push({posX:2*resolut,posY:resolut,part:'tail',ang:0 });

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
    }else{
       clearTimeout(t);
    }
    drawGame();
}

function checkCollision(){
    if(warmVec.size !== 0) {
        for (var i = 0; i <= warmVec.size - 1; i++) {
            if (miamVec.size !== 0) {
                if (((warmVec[0].posX + vHead.x) === miamVec[y].x) && ((warmVec[0].posY + vHead.y) === miamVec[y].y)) {
                    score = score + 1;
                    addMiam();
                    warmVec[0].part = bigHead;
                }
            }
        }

        if (((warmVec[0].posX + vHead.x) || (warmVec[0].posY + vHead.y)) <= 0) {
            return true;
        } else if ((warmVec[0].posX + vHead.x) >= WIDTH) {
            return true;
        } else if ((warmVec[0].posY + vHead.y) >= HEIGHT) {
            return true;
        }

        for (var x = 1; x <= warmVec.size - 1; x++) {
            if (((warmVec[0].posX + vHead.x) === warmVec[x].posX) && ((warmVec[0].posY + vHead.y) === warmVec[x].posY)) {
                return 1;
            }
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
        if(warmVec[size-2].part === type.BIGBODY){
            warmVec.add({posX:warmVec[size-1].posX,posY:warmVec[size-1].posY,part:tail,angle:warmVec[size-1].angle});
            size = size+1;
        }else{
            warmVec[size-1].posX = warmVec[size-2].posX;
            warmVec[size-1].posY = warmVec[size-2].posY;
            warmVec[size-1].ang = warmVec[size-2].ang;
        }

        //body
        for(let x =size-2; x> 1 ;x--){
            warmVec[x].p.x = warmVec[x-1].posX;
            warmVec[x].p.y = warmVec[x-1].posY;
            warmVec[x].ang = warmVec[x-1].ang;
            if(warmVec[x-1].part === type.BIGHEAD){
                warmVec[x].part = bigBody;
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
        warmVec.get(0).ang = 3;
    }else if(vHead.y < 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec.get(0).ang = 2;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec.get(0).ang = 1;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = resolut;
        warmVec.get(0).ang = 0;
    }
}

function turnL(){
    if(vHead.x > 0){
        vHead.x = 0;
        vHead.y = resolut;
        warmVec.get(0).ang = 1;
    }else if(vHead.y > 0){
        vHead.y = 0;
        vHead.x = -resolut;
        warmVec.get(0).ang = 2;
    }else if(vHead.x < 0){
        vHead.x = 0;
        vHead.y = -resolut;
        warmVec.get(0).ang = 3;
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

    let m = new pos(0,0);
    m.x = x;
    m.y= y;
    miamVec.push(m);
}

function drawGame(){

   // ctx.drawImage(background,0,0);

    for(let i =0; i <= warmVec.length;i++){
        switch (warmVec[i].part){
            case 'bigHead':
                ctx.drawImage(bigHead, warmVec[i].posX, warmVec[i].posY,1,(Math.PI / 2)*warmVec[i].ang);
                break;
            case 'head':
                ctx.drawImage(head, warmVec[i].posX, warmVec[i].posY,2,(Math.PI / 2)*warmVec[i].ang);
                break;
            case 'bigBody':
                ctx.drawImage(bigBody, warmVec[i].posX, warmVec[i].posY,1,(Math.PI / 2)*warmVec[i].ang);
                break;
            case 'body':
                ctx.drawImage(body, warmVec[i].posX, warmVec[i].posY,1,(Math.PI / 2)*warmVec[i].ang);
                break;
            case 'tail':
                ctx.drawImage(tail, warmVec[i].posX, warmVec[i].posY,1,(Math.PI / 2)*warmVec[i].ang);
                break;
            default:
                break;
        }
    }
    for(var i =0; i <= miamVec.size;i++){
        ctx.drawImage(miam, miamVec[i].x, miamVec[i].y);
    }

}

function drawGameOver (){
    ctx.drawImage(background,0,0);
    ctx.drawImage(gameOver, (WIDTH/2)-gameOver.width-gameOver.width, (HEIGHT/2)-gameOver.height-gameOver.height);
}
