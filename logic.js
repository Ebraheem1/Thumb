export var backgroundMode = true;
//Thumb State = 0, indicates adduction for the thumb
export var thumbState = 0;
export var adductionState = 0;
export var movementState = 0;
export var width = 480;
export var height = 360;
export var drawElipse;
export var checkDistMine;
// 0 indicates thumb, 1 adduction, 2 abduction
export var gameMode = -1;
export var thumbGame = false;
export var adductionGame = false;
export var abductionGame = false;
export var playLaser;
export var progressBarColor;
export var setGameMode;
export var setBackGroundMode;
export var setThumbState;

//var Processing = require('./processing.js');
var sketchProc = function(processing)
{
  //CREATED BY BRAVE DYLAN HAGER
  //802 COMPUTERS ELECTIVE

  //creation of variables
  //float - decimal
  //PImage - processing.image
  
  //--Background Variables
  var background = 0;
  //--Thumb Game buttons
  
  var thumbColor = 0;
  var thumbRect = 0;
  //--Adduction Game buttons
  
  var adductionColor = 0;
  var adductionRect = 0;
  //--Abduction Game buttons
   
  var abductionColor = 0;
  var abductionRect = 0;
  //--Progress-Bar Colors
  var progressBarRect = 0;
  
  //--
  var x = 0;
  var y = 0;

  //--Game Variables
  
  var vX = 0;
  var posX = 240;
  var pReg = 0;
  var pLeft = 0;
  var pRight = 0;
  var redLaser = 0;
  var eI = 0;
  var mouseC = 0;
  var gDisplay= 0;
  var bg1= 0;
  var sL= 0;
  var metI= 0;
  var player= 0;
  var laserY = 0;
  var laserX = 0;
  var enemyX = 0;
  var enemyY = 0;
  var enemyType= 0;
  var enemyH = 0;
  var enemyS = 0;
  var pointDis = 0;
  var standrd= 0;
  var gameOver= 0;
  var sl1y= 0;
  var sl2y= 0;
  var sl3y= 0;
  var sl4y= 0;
  var sl5y= 0;
  var sl6y= 0;
  var sl1x= 0;
  var sl2x= 0;
  var sl3x= 0;
  var sl4x= 0;
  var sl5x= 0;
  var sl6x= 0;
  var slS = 40;
  var mX= 0;
  var mY= 0;
  var pH= 0;
  var i= 0;
  var prevFrame = 0;
  
  setThumbState = function(value)
  {
    thumbState = value;
  }
  setGameMode = function(value)
  {
    gameMode = value;
  }
  setBackGroundMode = function(flag)
  {
    backgroundMode = flag;
  }
  drawElipse = function (xx , yy) {
    x = xx;
    y =yy;
    processing.ellipse(x, y, 15, 15);
  }
  //run once, at startup
  processing.setup = function(){
    processing.size(480,360);
    //note that the preset FPS is 60, considerably useless
    //most games run at 30 FPS
    processing.frameRate(30);
    importImgs();
    initializeButtons();
    gameOver = 0;
    enemyS = 3;
    pH = 3;
  }
  function initializeButtons(){
    thumbColor = processing.color(255,  0, 0);
    thumbRect = processing.color(0, 0, 0);

    adductionColor = processing.color(51, 255, 255);
    adductionRect = processing.color(0, 0, 0);

    abductionColor = processing.color(255, 255, 51);
    abductionRect = processing.color(0,  0, 0);
  }

  //imports all images needed
  function importImgs() {
    pReg = processing.loadImage("../pic/player.png");
    pLeft = processing.loadImage("../pic/playerLeft.png");
    pRight = processing.loadImage("../pic/playerRight.png");
    redLaser = processing.loadImage("../pic/laserRed.png");
    eI = processing.loadImage("../pic/enemyShip.png");
    mouseC = processing.loadImage("../pic/redShot.png");
    standrd = processing.loadFont("../standrd.vlw");
    gDisplay = processing.loadImage("../pic/endDisp.png");
    bg1 = processing.loadImage("../pic/starBackground.png");
    sL = processing.loadImage("../pic/speedLine.png");
    metI = processing.loadImage("../pic/meteorSmall.png");
    player =processing.loadImage("../pic/life.png");
    background = processing.loadImage("../pic/black-background.jpg");
  }

  //done every tick (30 FPS)
  processing.draw = function() {
    if(backgroundMode)
    {
      backgroundImg();
      processing.rectMode(processing.CENTER);
      processing.fill(thumbRect);
      //.rect(x-coordinate, y-coordinate, width, height)
      processing.rect(processing.width/2, 140, 120, 50);
      processing.textSize(15);
      processing.fill(thumbColor);
      processing.text("Thumb Game", processing.width/2-55, 140);

      processing.fill(adductionRect);
      processing.rect(processing.width/2, 220, 120, 50);
      processing.textSize(15);
      processing.fill(adductionColor);
      processing.text("Adduction Game", processing.width/2-55, 220);

      processing.fill(abductionRect);
      processing.rect(processing.width/2, 300, 120, 50);
      processing.textSize(15);
      processing.fill(abductionColor);
      processing.text("New Movement", processing.width/2-55, 300);

      checkHandPosition();
    }else{
      drawBg();
      drawProgressBar();
      //processing.noCursor();
      //checkDist();
      //vX = vX * 0.9;
      processing.imageMode(processing.CENTER);
      processing.image(redLaser,laserX,laserY-40);
      laserY = laserY - 40;
      //printPlayer();
      printPlayerMine();
      printEnemy();
      printMeteor();
      damageCheck();
      printScore();
      enemyS = 1;
      //enemyS = pointDis * 0.002  + 1;
      genSL();
      processing.imageMode(processing.CENTER);
      processing.image(mouseC,posX,300);
      processing.image(sL,sl1x,sl1y);
      processing.image(sL,sl2x,sl2y);
      processing.image(sL,sl3x,sl3y);
      printHealth();
      if (gameOver == 1) {
        processing.image(gDisplay,240,180);
        processing.textFont(standrd);
        processing.textAlign(processing.CENTER);
        processing.text(pointDis, 240, 320);
        var slS = pointDis*0.04 + 10;
      }
    }
  }

  function drawProgressBar(){
    processing.rectMode(processing.CENTER);
    processing.fill(progressBarRect);
    //.rect(x-coordinate, y-coordinate, width, height)
    processing.rect(400, 45, 80, 10);
  }


  function checkHandPosition(){
    var w = processing.width / 2;
    //check over the horizontal range of the buttons
    if((x >= w-60) && (x <= w + 70)){
      //Check whether the mouse is hovering over the thumb button
      if((y >= 115) && (y <= 165)){
        thumbRect = processing.color(255, 229, 204);
        thumbGame = true;
      }
      //Check whether the mouse is hovering over the adduction button
      else if((y >= 195) && (y <= 245))
      {
        adductionRect = processing.color(255, 229, 204);
        adductionGame = true;
      }
      //Check whether the mouse is hovering over the abduction button
      else if((y >= 275) && (y <= 325))
      {
        abductionRect = processing.color(255, 229, 204);
        abductionGame = true;
      }
      else{
        resetButtons();
      }
    }
    else{
      resetButtons();
    }
  }

  function resetButtons(){
    thumbRect = processing.color(0, 0, 0);
    adductionRect = processing.color(0, 0, 0);
    abductionRect = processing.color(0, 0, 0);
    thumbGame = false;
    adductionGame = false;
    abductionGame = false;
  }

  // //checking if x needs to be updated
  // function checkDist() {
  //   //if x is not close to mouse's x, increase velocity
  //   //var pos = hand.stabilizedPalmPosition;
  //   console.log('mouseX is: ', processing.mouseX);
  //   if (posX > processing.mouseX + 8 || posX < processing.mouseX - 8) {
  //     if (posX > processing.mouseX) {
  //       vX = vX - 2.3;
  //     } else {
  //       vX = vX + 2.3;
  //     }
  //   } else {
  //     posX = processing.mouseX;
  //   }
  // }

  function backgroundImg(){
          
    processing.imageMode(processing.CORNER);
    processing.image(background,0,0);
    //processing.image(background,480,0);
    //processing.image(background,0,360);
    //processing.image(background,480,360);
  }

  checkDistMine = function (hand)
  {
    var palmPosition = hand.stabilizedPalmPosition[0];
    var diff = palmPosition - prevFrame;
    if(processing.abs(diff) < 20)
    {
      posX += diff;
      prevFrame += diff;
    }
    else{
      if(diff > 0)
      {
        posX += 20;
        prevFrame += 20;
      }
      else{
        posX -= 20;
        prevFrame -= 20;
      }
    }
    if(posX < 0)
      posX = 0;
    else if(posX > 479)
      posX = 479;

    if((palmPosition >= -210) && (palmPosition <= 240))
    {
      progressBarColor(true);
    }else{
      progressBarColor(false);
    }
  }

  // function printPlayer() {
  // //drawing an processing.image at the x position
  //   processing.imageMode(processing.CENTER);
  //   if (processing.abs(vX) < 2) {
  //     processing.image(pReg,posX,300);
  //   } else {
  //     if (vX > 2) {
  //       processing.image(pRight,posX,300);
  // } else {
  //   processing.image(pLeft,posX,300);
  // }
  //   }
  // }

  function printPlayerMine(){
    processing.imageMode(processing.CENTER);
    if((posX > 150) && (posX < 330))
      processing.image(pReg,posX,300);
    else if (posX >= 330)
    {
      processing.image(pRight,posX,300);
    }
    else if(posX <= 150)
    {
      processing.image(pLeft,posX,300);
    }
  }

  playLaser= function () {
    if (laserY < 0) {
      laserY = 300;
      laserX = posX;
    }
  }

  function damageCheck() {
    if (laserX < enemyX + 30 && laserX > enemyX - 30 && laserY > enemyY - 70 && laserY < enemyY + 70) {
      enemyH = enemyH - 1;
      laserY = -10;
      pointDis = pointDis + 100;
    }
  }

  function printScore() {
      processing.textFont(standrd);
      processing.text(pointDis,10,40);
  }

  function printEnemy() {
    if (enemyH < 1) {
      enemyX = processing.random(20,460);
      enemyY = -40;
      enemyH = 2;
    } else {
      enemyY = enemyY + enemyS;
      if (enemyY > 340) {
        gameOver = 1;
    }
    processing.image(eI,enemyX,enemyY);
    }
  }



  function drawBg() {
    processing.imageMode(processing.CORNER);
    processing.image(bg1,0,0);
    processing.image(bg1,254,0);
    processing.image(bg1,0,255);
    processing.image(bg1,254,255);
  }

  function genSL() {
    if (sl1y > 360) {
      sl1x = processing.random(0,480);
      sl1y = processing.random(-40,0);
    }
    
    if (sl2y > 360) {
      sl2x = processing.random(0,480);
      sl2y = processing.random(-40,0);
    }
    
    if (sl3y > 360) {
      sl3x = processing.random(0,480);
      sl3y = processing.random(-40,0);
    }

    sl1y = sl1y + slS/2;
    sl2y = sl2y + slS/2;
    sl3y = sl3y + slS/2;
  }

  function printMeteor() {
    if (mY > 360) {
      mY = processing.random(-100,-40);
      mX = processing.random(0,480);
    } else {
      mY = mY + 2;
      //mY = mY + pointDis * 0.008 + 5;
    }
    processing.image(metI,mX,mY);
    if (laserX < mX + 30 && laserX > mX - 30 && laserY > mY - 30 && laserY < mY + 30) {
      mY = 400;
    }
    if (posX < mX + 30 && posX > mX - 30 && 300 > mY - 30 && 300 < mY + 30) {
      pH = pH - 1;
      mY = 400;
      if (pH == 0) {
        gameOver = 1;
      }
    }
  }

  function printHealth() {
    processing.imageMode(processing.CENTER);
    if (pH == 3) {
      processing.image(player,440,20);
      processing.image(player,400,20);
      processing.image(player,360,20);
    }
    
    if (pH == 2) {
      processing.image(player,400,20);
      processing.image(player,360,20);
    }

    if (pH == 1) {
      processing.image(player,360,20);
    }
  }
  

  progressBarColor = function(handDetected)
  {
    if(handDetected)
    {
      progressBarRect = processing.color(0, 255, 0);
    }
    else{
      progressBarRect = processing.color(255, 0, 0);
    }
  }

  

  function handAbduction() {
    if(thumbIndexAngle >= 30 && indexMidAngle >= 10 && midRingAngle >= 10 && ringPinkyAngle >= 10)
      return true;
    
    return false;
  }

  



  
}
var canvas = document.getElementById("canvas1");
var p = new Processing(canvas, sketchProc);