import { backgroundMode, setBackGroundMode, adductionState, movementState, thumbState, width, height, drawElipse 
, checkDistMine, setGameMode, playLaser, progressBarColor, thumbGame, adductionGame, abductionGame,
 gameMode, setThumbState} from '../logic';
//-- Leap Bones


var Leap = require('leapjs');  
var thumbIndexAngle = 0;
var indexMidAngle = 0;
var midRingAngle = 0;
var ringPinkyAngle = 0;
var indexAngle = 0;
var middleAngle = 0;
var ringAngle = 0;
var pinkyAngle = 0;

function handAdduction() {
    var mainCondition = (indexMidAngle <= 10) && (midRingAngle <= 10) && (ringPinkyAngle <= 10);
    if(mainCondition && (!adductionState))
    {
      adductionState = 1;
      return true;
    }
    else if((!mainCondition) && (adductionState))
    {
      adductionState = 0;
      return false;
    }
    else
      return false;
};
var options = {
    background: true,
    useAllPlugins: true,
    enableGestures: true
};

function checkMovement(){
    if((indexAngle < 0) && (middleAngle < 0) && (ringAngle < 0) && (pinkyAngle < 0) && (movementState)){
      movementState = 0;
      return false;
    }
    else if ((indexAngle > 0) && (middleAngle > 0) && (ringAngle > 0) && (pinkyAngle > 0) && (!movementState))
    {
      movementState = 1;
      return true;
    }
    else 
      return false;
};


var measuringAngleBetweenFingers = function(hand)
{
    var thumbDirection = hand.thumb.medial.direction();
    var indexDirection = hand.indexFinger.proximal.direction();
    var middleDirection = hand.middleFinger.proximal.direction();
    var ringDirection = hand.ringFinger.proximal.direction();
    var pinkyDirection = hand.pinky.proximal.direction();

    //Some variables to detect the required movement
    var indexMetCarpal = hand.indexFinger.metacarpal.direction();
    var middleMetCarpal = hand.middleFinger.metacarpal.direction();
    var ringMetCarpal = hand.ringFinger.metacarpal.direction();
    var pinkyMetCarpal = hand.pinky.metacarpal.direction();

    indexAngle = Math.acos(Leap.vec3.dot(indexDirection, indexMetCarpal)) * (180 / Math.PI);
    middleAngle = Math.acos(Leap.vec3.dot(middleDirection, middleMetCarpal)) * (180 / Math.PI);
    ringAngle = Math.acos(Leap.vec3.dot(ringDirection, ringMetCarpal)) * (180 / Math.PI);
    pinkyAngle = Math.acos(Leap.vec3.dot(pinkyDirection, pinkyMetCarpal)) * (180 / Math.PI);

    if(indexDirection[1] < indexMetCarpal[1])
    indexAngle *= -1;
    if(middleDirection[1] < middleMetCarpal[1])
    middleAngle *= -1;
    if(ringDirection[1] < ringMetCarpal[1])
    ringAngle *= -1;
    if(pinkyDirection[1] < pinkyMetCarpal[1])
    pinkyAngle *= -1;

    thumbIndexAngle = Math.acos(Leap.vec3.dot(thumbDirection, indexDirection)) * (180 / Math.PI);
    indexMidAngle = Math.acos(Leap.vec3.dot(indexDirection, middleDirection)) * (180 / Math.PI);
    midRingAngle = Math.acos(Leap.vec3.dot(middleDirection, ringDirection)) * (180 / Math.PI);
    ringPinkyAngle = Math.acos(Leap.vec3.dot(ringDirection, pinkyDirection)) * (180 / Math.PI);
};

function checkThumb() {
    if(thumbIndexAngle > 30 && (! thumbState)){
        setThumbState(1);
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

var controller= Leap.loop(options, function(frame)
{
  if((frame.hands.length == 1)){
    if(backgroundMode)
    {
      var pos = frame.pointables[1].stabilizedTipPosition;
      var normPos = frame.interactionBox.normalizePoint(pos, true);
      var x = width * normPos[0];
      var y = height * (1 - normPos[1]);
      drawElipse(x, y);
    }
    else if(!backgroundMode)
    {
      checkDistMine(frame.hands[0]);
      measuringAngleBetweenFingers(frame.hands[0]);
      if((gameMode == 0 && checkThumb()) || (gameMode == 1 && handAdduction()) || (gameMode == 2 && checkMovement())) {
        playLaser();
      }
    }
  }
  else if(frame.hands.length == 0)
  {
    progressBarColor(false);
  }

});
controller.on("gesture", function(gesture){
    if(gesture.type == "keyTap")
    {
        if(thumbGame)
        {
          
          setGameMode(0);
          setBackGroundMode(false);
        }else if(adductionGame)
        {
          setGameMode(1);
          setBackGroundMode(false);
        }else if(abductionGame)
        {
          setGameMode(2);
          setBackGroundMode(false);
        }
    }
});