import { thumbState, width, height, checkDistMine, playLaser, progressBarColor,
   thumbGame, setThumbState} from '../logic';
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

var prevprev = 0;
var prevThumbIndexAngle = 0;
var prevtime = 0;
var timetaken = 0;

var options = {
    background: true,
    useAllPlugins: true,
    enableGestures: true
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

    prevprev = prevThumbIndexAngle;
    prevThumbIndexAngle = thumbIndexAngle;

    thumbIndexAngle = Math.acos(Leap.vec3.dot(thumbDirection, indexDirection)) * (180 / Math.PI);
    indexMidAngle = Math.acos(Leap.vec3.dot(indexDirection, middleDirection)) * (180 / Math.PI);
    midRingAngle = Math.acos(Leap.vec3.dot(middleDirection, ringDirection)) * (180 / Math.PI);
    ringPinkyAngle = Math.acos(Leap.vec3.dot(ringDirection, pinkyDirection)) * (180 / Math.PI);

    if(thumbIndexAngle <= 30 && prevprev > prevThumbIndexAngle && thumbIndexAngle > prevThumbIndexAngle) prevtime = new Date();
};

function checkThumb() {
    if(thumbIndexAngle > 30 && (!thumbState)){
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

var controller = Leap.loop(options, function(frame)
{
  if((frame.hands.length == 1)){

    checkDistMine(frame.hands[0]);
    measuringAngleBetweenFingers(frame.hands[0]);

    if(checkThumb()) {
      var now = new Date();
      timetaken = now - prevtime;
      console.log(timetaken);

      playLaser();
    }
  }
  else if(frame.hands.length == 0)
  {
    progressBarColor(false);
  }

});
