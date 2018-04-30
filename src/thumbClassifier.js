import { thumbState, width, height, checkDistMine, playLaser, progressBarColor,
    thumbGame, setThumbState, gameOver, setTextEnding, pointDis,
    textToBeDisplayed, setCheatingText} from '../logic';
import {currentFrame as frame, Leap } from './leapController';

var thumbIndexAngle = 0;
var times = [];
var maxAngle = -10;
var minAngle = 200;
var counter = 0;

//Variables for speed detection
var prevtime = 0;
var timetaken = 0;
var firstFrame = true;

var cheatedTime = 0;
var startcheat = 0;
var alreadyCheating = false;

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
    setTextEnding('Max time is: ' + Number.parseFloat(maxTime).toPrecision(4) + ' sec(s)',
    'Max Angle is: ' + Number.parseFloat(maxAngle).toPrecision(4), 'Min Angle is: '+ Number.parseFloat(minAngle).toPrecision(4),
    'Number of Times of thresholds are: ' + counter);
}

function directionUp(tipPosition, metacarpal) {
  if(tipPosition[1] > metacarpal[1]) return true;
  else return false;
}

(function thumbClassifierController(){
    if( frame && (frame.hands.length == 1) && (! gameOver) && (pointDis < 2000)) {
        var hand = frame.hands[0];

        var palmPosition = hand.stabilizedPalmPosition[1];
        var pos = frame.pointables[1].stabilizedTipPosition;
        var normPos = frame.interactionBox.normalizePoint(pos, true);
        var x = width * normPos[0];
        checkDistMine(x);

        var armDirection = hand.arm.direction();
        var handDirection = hand.direction;

        var wristAngle = Math.acos(Leap.vec3.dot(armDirection, handDirection)) * (180 / Math.PI);

        //Roll here represents the rotation around the z-axis
        var rotationAngle = hand.roll() * (180 / Math.PI);
        if(hand.stabilizedPalmPosition[1] < 270)
        {
          setCheatingText('Please, Raise your hand a bit more :)');
          if(!alreadyCheating) {
            startcheat = new Date();
            alreadyCheating = true;
          }
        }
        else if(Math.floor(rotationAngle) > 20)
        {
          if(textToBeDisplayed == 'NA')
          {
            setCheatingText('Rotate your hand to the right to be flat.');
            startcheat = new Date();
            alreadyCheating = true;
          }
        } else if(Math.floor(rotationAngle) < -20)
        {
          if(textToBeDisplayed == 'NA')
          {
            setCheatingText('Rotate your hand to the left to be flat.');
            startcheat = new Date();
            alreadyCheating = true;
          }
        } else if(wristAngle > 20) {
          var tip = hand.middleFinger.dipPosition;
          var metacar = hand.middleFinger.mcpPosition;
          var flag = directionUp(tip, metacar);
          if(textToBeDisplayed == 'NA') {
            if(flag) setCheatingText('Move your hand down');
            else setCheatingText('Move your hand up');

            startcheat = new Date();
            alreadyCheating = true;
          }
        } else if(hand.grabStrength > 0.1)
        {
          if(textToBeDisplayed == 'NA'){
            setCheatingText('Please Stretch Your Fingers');
            startcheat = new Date();
            alreadyCheating = true;
          }
        }
        else {
            if(alreadyCheating) {
              alreadyCheating = false;
              var now = new Date();
              cheatedTime += now - startcheat;
            }
            setCheatingText('NA');
        }

        if(!alreadyCheating){
          measuringAngleBetweenFingers(hand);

          if(checkThumb()){
            var now = new Date();
            timetaken = now - prevtime - cheatedTime;
            console.log("cheating time: ", cheatedTime);
            cheatedTime = 0;
            prevtime = now;
            if(timetaken > 0) times.push(timetaken);
            console.log(Number.parseFloat(timetaken).toPrecision(4));
            playLaser();
          }
        }
        var pointable = frame.pointables[0];
    }
    else if(frame && frame.hands.length == 0 && (! gameOver))
    {
      if(!alreadyCheating) {
        startcheat = new Date();
        alreadyCheating = true;
      }
      progressBarColor(false);
    }
    if((gameOver) || (pointDis == 2000))
    {
      doStatistics();
    }
    setTimeout(thumbClassifierController, 1);
})();



































//
