//Thumb State = 0, indicates adduction for the thumb
export var thumbState = 0;
export var width = window.innerWidth;
export var height = window.innerHeight;
export var checkDistMine;
export var thumbGame = false;
export var playLaser;
export var progressBarColor;
export var setThumbState;
export var gameOver = 0;
export var setTextEnding;
export var pointDis = 0;
export var textToBeDisplayed;
export var setCheatingText;

var sketchProc = function(processing)
{
  //--Background Variables
  var background = 0;

  //--Progress-Bar Colors
  var progressBarRect = 0;
  var x = 0;
  var y = 0;

  //--Game Variables
  var posX = 240;
  var pReg = 0;
  var pLeft = 0;
  var pRight = 0;
  var redLaser = 0;
  var eI = 0;
  var mouseC = 0;
  var gDisplay  = 0;
  var bg1 = 0;
  var sL  = 0;
  var metI  = 0;
  var player  = 0;
  var laserY = 0;
  var laserX = 0;
  var enemyX = 0;
  var enemyY = 0;
  var enemyType = 0;
  var enemyH = 0;
  var enemyS = 0;

  var standrd = 0;

  var sl1y = 0;
  var sl2y = 0;
  var sl3y = 0;
  var sl4y = 0;
  var sl5y = 0;
  var sl6y = 0;
  var sl1x = 0;
  var sl2x = 0;
  var sl3x = 0;
  var sl4x = 0;
  var sl5x = 0;
  var sl6x = 0;
  var slS = 40;
  var mX = 0;
  var mY = height + 1;
  var pH = 0;
  var i = 0;
  var prevFrame = 0;

  //Statistics Variables
  var maxTimeText;
  var maxAngleText;
  var minAngleText;
  var thresholdTimesText;

  //Cheating Variables
  textToBeDisplayed = 'NA';

  setCheatingText = function(text)
  {
    textToBeDisplayed = text;
  }

  setTextEnding = function(mt, ma, mna, tt){
    maxTimeText = mt;
    maxAngleText = ma;
    minAngleText = mna;
    thresholdTimesText = tt;
  };


  setThumbState = function(value)
  {
    thumbState = value;
  }
  //run once, at startup
  processing.setup = function(){
    processing.size(width, height);
    //note that the preset FPS is 60, considerably useless
    //most games run at 30 FPS
    processing.frameRate(30);
    importImgs();
    gameOver = 0;
    enemyS = 3;
    pH = 3;
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
    //gDisplay = processing.loadImage("../pic/insert-coin.png");
    bg1 = processing.loadImage("../pic/starBackground.png");
    sL = processing.loadImage("../pic/speedLine.png");
    metI = processing.loadImage("../pic/meteorSmall.png");
    player =processing.loadImage("../pic/life.png");
    background = processing.loadImage("../pic/black-background.jpg");
  }

  //done every tick (30 FPS)
  processing.draw = function() {
    if(gameOver == 0 && pointDis < 2000)
    {
      drawBg();
      drawProgressBar();
      processing.imageMode(processing.CENTER);
      processing.image(redLaser,laserX,laserY-40);
      laserY = laserY - 40;
      printPlayerMine();
      printEnemy();
      printMeteor();
      damageCheck();
      printScore();
      enemyS = 1;
      genSL();
      processing.imageMode(processing.CENTER);
      processing.image(mouseC,posX,height - 60);
      processing.image(sL,sl1x,sl1y);
      processing.image(sL,sl2x,sl2y);
      processing.image(sL,sl3x,sl3y);
      printHealth();
      if(textToBeDisplayed != 'NA')
      {
        var color = processing.color(0, 0, 0);
        var fontSize = 25;
        processing.fill(color);
        processing.textSize(fontSize);
        processing.text(textToBeDisplayed, width/4, height/2);
      }
    }
    else if (gameOver == 1 && pointDis < 2000) {
      var slS = pointDis*0.04 + 10;
      var color = processing.color(255, 255, 255);
      var fontSize = 25;
      processing.fill(color);
      processing.textSize(fontSize);
      processing.background(0, 0, 0);
      processing.text(maxTimeText, 25, 45);
      processing.text(maxAngleText, 25, 70);
      processing.text(minAngleText, 25, 95);
      processing.text(thresholdTimesText, 25, 120);
      processing.text('Gained Points: ' + slS, 25, 145);
      processing.text('Try Again Press Up :)', 25, 170);

    }
    else if( pointDis >= 2000 && gameOver != 1)
    {
      var color = processing.color(0, 255, 0);
      var fontSize = 25;
      processing.fill(color);
      processing.textSize(fontSize);
      processing.background(0, 0, 0);
      processing.text(maxTimeText, 25, 45);
      processing.text(maxAngleText, 25, 70);
      processing.text(minAngleText, 25, 95);
      processing.text(thresholdTimesText, 25, 120);
      processing.text('Congratulations Press Up To play again :)', 10, 170);
    }
  }

  function drawProgressBar(){
    processing.rectMode(processing.CENTER);
    processing.fill(progressBarRect);
    //.rect(x-coordinate, y-coordinate, width, height)
    processing.rect(width - 80, 45, 80, 10);
  }


  checkDistMine = function(palmPosition, position) {
    posX = position;
    if((palmPosition >= -210) && (palmPosition <= 240))
    {
      progressBarColor(true);
    } else {
      progressBarColor(false);
    }
  }

  function printPlayerMine(){
    processing.imageMode(processing.CENTER);

    var left = width/4;
    var right = 3*width/4;

    if((posX > left) && (posX < right)) processing.image(pReg, posX, height - 60);
    else if (posX >= right) processing.image(pRight, posX, height - 60);
    else if(posX <= left) processing.image(pLeft, posX, height - 60);
  }

  playLaser = function () {
    if (laserY < 0) {
      laserY = height - 60;
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
      processing.textSize(20);
      processing.text(pointDis,20,40);
  }

  function printEnemy() {
    if (enemyH < 1) {
      enemyX = processing.random(20, width);
      enemyY = -40;
      enemyH = 2;
    } else {
      enemyY = enemyY + enemyS;
      if (enemyY > height - 40 && pointDis < 2000) {
        gameOver = 1;
    }
    processing.image(eI,enemyX,enemyY);
    }
  }

  function drawBg() {
    processing.imageMode(processing.CORNER);
    for(var i = 0; i < width; i+=254)
      for(var j = 0; j < height; j+=254)
        processing.image(bg1,i,j);
  }

  function genSL() {
    if (sl1y > 360) {
      sl1x = processing.random(0,width);
      sl1y = processing.random(-40,0);
    }

    if (sl2y > 360) {
      sl2x = processing.random(0,width);
      sl2y = processing.random(-40,0);
    }

    if (sl3y > 360) {
      sl3x = processing.random(0,width);
      sl3y = processing.random(-40,0);
    }

    sl1y = sl1y + slS/2;
    sl2y = sl2y + slS/2;
    sl3y = sl3y + slS/2;
  }

  function printMeteor() {
    if (mY > height) {
      mY = processing.random(-100,-40);
      mX = processing.random(50, width - 20);
      console.log(mX);
    } else {
      mY = mY + 2;
    }
    processing.image(metI, mX, mY);
    if (laserX < mX + 30 && laserX > mX - 30 && laserY > mY - 30 && laserY < mY + 30) mY = height + 30;

    if (posX < mX + 30 && posX > mX - 30 && height - 60 > mY - 30 && height - 60 < mY + 30) {
      pH = pH - 1;
      mY = height + 30;
      if (pH == 0) {
        gameOver = 1;
      }
    }
  }

  function printHealth() {
    processing.imageMode(processing.CENTER);
    if (pH == 3) {
      processing.image(player, width - 40, 20);
      processing.image(player, width - 80, 20);
      processing.image(player, width - 120, 20);
    }

    if (pH == 2) {
      processing.image(player, width - 80, 20);
      processing.image(player, width - 120, 20);
    }

    if (pH == 1) {
      processing.image(player, width - 120, 20);
    }
  }

  processing.keyPressed = function()
  {
      if((processing.key == processing.CODED) && ((gameOver) || (pointDis >= 2000)))
      {
          if(processing.keyCode == processing.UP)
          {
            posX = 240;
            laserY = 0;
            laserX = 0;
            enemyX = 0;
            enemyY = 0;
            enemyType= 0;
            enemyH = 0;
            enemyS = 3;
            pH = 3;
            gameOver = 0;
            sl1y = 0;
            sl2y = 0;
            sl3y = 0;
            sl4y = 0;
            sl5y = 0;
            sl6y = 0;
            sl1x = 0;
            sl2x = 0;
            sl3x = 0;
            sl4x = 0;
            sl5x = 0;
            sl6x = 0;
            slS = 40;
            mX = 0;
            mY = height + 1;
            i = 0;
            pointDis = 0;
            prevFrame = 0;
            textToBeDisplayed = 'NA';
          }
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
      textToBeDisplayed = 'NA';
    }
  }
}
var canvas = document.getElementById("canvas1");
var p = new Processing(canvas, sketchProc);
