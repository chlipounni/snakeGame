//canvas
var gw = document.getElementById('GameWindow');
var ctx = gw.getContext('2d');

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
//int timeD = 40; //non utiliser pour le momant, par de rafraichisement continue
var sp = false;



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
var gameOver;
var background;

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
    warmVec = [];
    warmVec.add({posX:4*resolut,posY:resolut,part:head,ang:0 });
    warmVec.add({posX:3*resolut,posY:resolut,part:tail,ang:0 });
    warmVec.add({posX:2*resolut,posY:resolut,part:body,ang:0 });

    vHead.x= resolut;
    vHead.y=0;

    //miam
    miamVec = [];
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
            warmVec.add({posX:warmVec.get(size-1).posX,posY:warmVec.get(size-1).py,part:tail,ang:0});
            size = size+1;
        }else{
            warmVec.get(size-1).p.x = warmVec.get(size-2).p.x;
            warmVec.get(size-1).p.y = warmVec.get(size-2).p.y;
            warmVec.get(size-1).ang = warmVec.get(size-2).ang;
        }

        //body
        for(let x =size-2; x> 1 ;x--){
            warmVec.get(x).p.x = warmVec.get(x-1).p.x;
            warmVec.get(x).p.y = warmVec.get(x-1).p.y;
            warmVec.get(x).ang = warmVec.get(x-1).ang;
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

    let m = new pos;
    m.x = x;
    m.y= y;
    miam.add(m);
}

function drawGame(){

    ctx.drawImage(background,0,0);

    for(let i =1; i <= warmVec.size;i++){
        switch (warmVec.get(i).type){
            case 'bigHead':
                ctx.drawImage(bigHead, warmVec.get(i).p.x, warmVec.get(i).p.y,1,(Math.PI / 2)*warmVec.get(i).ang);
                break;
            case head:
                ctx.drawImage(head, warmVec.get(i).p.x, warmVec.get(i).p.y,1,(Math.PI / 2)*warmVec.get(i).ang);
                break;
            case bigBody:
                ctx.drawImage(bigBody, warmVec.get(i).p.x, warmVec.get(i).p.y,1,(Math.PI / 2)*warmVec.get(i).ang);
                break;
            case body:
                ctx.drawImage(body, warmVec.get(i).p.x, warmVec.get(i).p.y,1,(Math.PI / 2)*warmVec.get(i).ang);
                break;
            case tail:
                ctx.drawImage(tail, warmVec.get(i).p.x, warmVec.get(i).p.y,1,(Math.PI / 2)*warmVec.get(i).ang);
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
    ctx.drawImage(background,0,0);
    ctx.drawImage(gameOver, (WIDTH/2)-gameOver.width-gameOver.width, (HEIGHT/2)-gameOver.height-gameOver.height);

}

document.onload = function (){
    bigHead =   document.getElementById("bigHead");
    head    =   document.getElementById("head");
    bigBody =   document.getElementById("bigBody");
    body    =   document.getElementById("body");
    tail    =   document.getElementById("tail");
    miam    =   document.getElementById("miam");
    gameOver =  document.getElementById("gameOver");
    background = document.getElementById("background")


    reStart();
    drawGame();
}

