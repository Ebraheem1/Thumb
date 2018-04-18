import { thumbState, width, height, checkDistMine, playLaser, progressBarColor,
   thumbGame, setThumbState, gameOver, setTextEnding, pointDis} from '../logic';
//-- Leap Bones


var Leap = require('leapjs');
var thumbIndexAngle = 0;
var times = [];
var maxAngle = -10;
var minAngle = 200;
var counter = 0;

//Variables for speed detection
var prevtime = 0;
var timetaken = 0;
var firstFrame = true;


var options = {
    background: true,
    useAllPlugins: true,
    enableGestures: true
};




var measuringAngleBetweenFingers = function(hand)
{
    var thumbDirection = hand.thumb.medial.direction();
    var indexDirection = hand.indexFinger.proximal.direction();
    thumbIndexAngle = Math.acos(Leap.vec3.dot(thumbDirection, indexDirection)) * (180 / Math.PI);

    if(thumbIndexAngle > maxAngle)
    {
        maxAngle = thumbIndexAngle;
    }
    if(thumbIndexAngle < minAngle && minAngle > 0)
    {
        minAngle = thumbIndexAngle;
    }
};

function checkThumb() {
    if(firstFrame)
    {
        prevtime = new Date();
        firstFrame = false;
    }
    else if(thumbIndexAngle > 30 && (!thumbState) && (prevtime > 0)){
        setThumbState(1);
        counter++;
        return true;
    }
    else if(thumbIndexAngle <= 30 && (thumbState))
    {
        setThumbState(0)
        return false;
    }
    else
        return false;
};

function doStatistics(){
    var maxTime = Math.max(...times);
    maxTime = maxTime / 1000;
    setTextEnding('Max time is: ' + maxTime + ' sec',
    'Max Angle is: ' + Math.floor(maxAngle), 'Min Angle is: '+ Math.floor(minAngle),
    'Number of Times of thresholds are: ' + counter);
}


var controller = Leap.loop(options, function(frame)
{
  if((frame.hands.length == 1) && (! gameOver)) {
    hand = frame.hands[0];
    var armDirection = hand.arm.direction();
    var handDirection = hand.direction;

    var wristAngle = Math.acos(Leap.vec3.dot(armDirection, handDirection)) * (180 / Math.PI);


    var palmPosition = hand.stabilizedPalmPosition[0];
    var pos = frame.pointables[1].stabilizedTipPosition;
    var normPos = frame.interactionBox.normalizePoint(pos, true);
    var x = 480 * normPos[0];
    checkDistMine(palmPosition, x);


    measuringAngleBetweenFingers(hand);

    if(checkThumb()) {
      var now = new Date();
      timetaken = now - prevtime;
      prevtime = now;
      times.push(timetaken);
      playLaser();
    }
  }
  else if(frame.hands.length == 0 && (! gameOver))
  {
    progressBarColor(false);
  }

  if((gameOver) || (pointDis == 2000))
  {
    doStatistics();
  }

});
