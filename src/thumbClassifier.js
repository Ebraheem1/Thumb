import { thumbState, width, height, checkDistMine, playLaser, progressBarColor,
    thumbGame, setThumbState, gameOver, setTextEnding, pointDis,
    textToBeDisplayed, setCheatingText} from '../logic';
import {currentFrame as frame, Leap } from './leapController';

// var c3 = require('c3');
import * as C3 from 'c3';

var thumbIndexAngle = 0;
var times = [];
var maxAngle = -10;
var minAngle = 200;
var counter = 0;
var frames = [];
var thumbIndexAngleArrDis = [];
var thumbIndexAngleArrCon = [];
var distalMedialArr = [];
var medialProximalArr = [];
var distal_medial;
var medial_proximal;
//Variables for speed detection
var prevtime = 0;
var timetaken = 0;
var firstFrame = true;
var statflag = true;
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

var measuringAnglesForFiltering = function(hand)
{
  var thumbDirection = hand.thumb.medial.direction();
  var indexDirection = hand.indexFinger.proximal.direction();
  var thumbDistal = hand.thumb.distal.direction();
  var thumbMedial = hand.thumb.medial.direction();
  var thumbProximal = hand.thumb.proximal.direction();
  distal_medial = Math.acos(Leap.vec3.dot(thumbDistal, thumbMedial)) * (180 / Math.PI);
  medial_proximal = Math.acos(Leap.vec3.dot(thumbMedial, thumbProximal)) * (180 / Math.PI);
  thumbIndexAngle = Math.acos(Leap.vec3.dot(thumbDirection, indexDirection)) * (180 / Math.PI);
}

function doFiltering() {
  frames.forEach(frame => {
    measuringAnglesForFiltering(frame.hands[0]);
    thumbIndexAngle = Number.parseFloat(thumbIndexAngle).toPrecision(4);
    thumbIndexAngleArrCon.push(thumbIndexAngle);
    if(frame.hands[0].confidence > 0.7) {
      thumbIndexAngleArrDis.push(thumbIndexAngle);
      distalMedialArr.push(distal_medial);
      medialProximalArr.push(medial_proximal);
    }
  });
  
 
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
    maxTime = Number.parseFloat(maxTime).toPrecision(4);
    if(pointDis >= 2000)
    {
      var charts = document.getElementById("charts");
      charts.style.display = "block";
      var p = document.getElementById('message');
      p.innerHTML = "Congratulations :)";
      
    }
    if(maxTime > 0)
    {
      var p = document.getElementById('max-time');
      p.innerHTML = "Max Time Taken is: "+ maxTime + " sec(s)";
    }
    var p = document.getElementById('threshold-times');
    p.innerHTML = 'Threshold reached: ' + counter+ " time(s)";
}

function directionUp(tipPosition, metacarpal) {
  if(tipPosition[1] > metacarpal[1]) return true;
  else return false;
}

(function thumbClassifierController(){
    if( frame && (frame.hands.length == 1) && (! gameOver) && (pointDis < 2000) && (pointDis != -1)) {
        if(!statflag){
          resetStats();
        }
        statflag = true;
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
            if(frames.length < 30000)
            {
              frames.push(frame);
            }
        }

        if(!alreadyCheating){
          measuringAngleBetweenFingers(hand);

          if(checkThumb()){
            var now = new Date();
            timetaken = now - prevtime - cheatedTime;
            cheatedTime = 0;
            prevtime = now;
            if(timetaken > 0) times.push(timetaken);
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
    if((gameOver) || (pointDis == 2000) || (pointDis == -1))
    {
      if(statflag)
      {
        doFiltering();
        doStatistics();
        drawScatterPlot();
        drawHistogram();
        
        var b = document.getElementById("play-again");
        b.style.visibility = "visible";
        statflag = false;
      }
    }
    setTimeout(thumbClassifierController, 1);
})();

function drawScatterPlot(){
  
  var scatterPlot = document.getElementById("scatter-plot");
  scatterPlot.style.height = "50%";
  scatterPlot.style.width = "90%";
  var scatterX = [];
  var scatterY = [];
  for(var i = 0; i < thumbIndexAngleArrCon.length; i++)
    scatterX.push(i+1);
  scatterX.unshift("frames");
  scatterY = thumbIndexAngleArrCon;
  scatterY.unshift("Angles");
  var scatterChart = C3.generate({
    bindto: scatterPlot,
    data: {
        xs: {
            Angles: 'frames'
        },
        columns: [
            scatterX,
            scatterY
        ],
        type: 'scatter',
        colors: {
          Angles: '#9F3030'
      }
    },
    axis: {
        x: {
            label: 'Ordered Frames',
            tick: {
                fit: false
            }
        },
        y: {
            label: 'Angle'
        }
    },
    title: {
      text: 'Angle between Thumb and Index in general'
    }
  });
};
// The x-axis represents the angles from 0 to 180, and each point is tha angle [n, n+4] where n is divisible by 5.
// The y-axis represents how many times the patient reached such angle.
function drawHistogram() {
  // thumbIndexAngleCount --> y-axis.
  // the first cell in array contains the name that represents the y-axis.
  // length of array is 37: (180/5)'the number of points' + 1 'the name of array'
  var thumbIndexAngleCount = Array(37).fill(0);
  var distalMedialCount = Array(37).fill(0);
  var proximalMedialCount = Array(37).fill(0);
  thumbIndexAngleCount[0] = 'Fingers';
  distalMedialCount[0] = 'DM';
  proximalMedialCount[0] = 'PM';

  
  for(var i = 0; i < thumbIndexAngleArrDis.length; i++) {
  	thumbIndexAngleCount[Math.ceil(thumbIndexAngleArrDis[i]/5)]++;
  }
  for(var i = 0; i < distalMedialArr.length; i++) {
  	distalMedialCount[Math.ceil(distalMedialArr[i]/5)]++;
  }
  for(var i = 0; i < medialProximalArr.length; i++) {
  	proximalMedialCount[Math.ceil(medialProximalArr[i]/5)]++;
  }
  
  // xAxis array is the angles.
  // the first cell contains the name that represents the x-axis.
  var xAxis = [];
  xAxis.push['Angles'];
  
  // each point in x-axis is the [angle, angle+4] where angle is divisible by 5
  for(var i = 1; i < 180; i+=5) {
    var s = i + ' to ' +(i+4);
    xAxis.push(s);
  }

  // removes the angles that was never reached by the patient
  for(var i = 1; i < 37; i++) {
    var condition = (thumbIndexAngleCount[i] == 0) && (distalMedialCount[i] == 0) && (proximalMedialCount[i] == 0);
  	if(condition) {
      thumbIndexAngleCount.splice(i, 1);
      distalMedialCount.splice(i, 1);
      proximalMedialCount.splice(i, 1);
  		xAxis.splice(i, 1);
  		i--;
  	}
  }
  
  var histoDiv = document.getElementById("Histogram");
  // // draws the graph
  histoDiv.style.height = "50%";
  histoDiv.style.width = "80%";
  var chart = C3.generate({
      bindto: histoDiv,
      data: {
          columns: [
              thumbIndexAngleCount,
              distalMedialCount,
              proximalMedialCount
          ],
      type: 'bar'
      },
      colors: {
        Fingers: '#ff0000',
        DM: '#00ff00',
        PM: '#0000ff'
      },
      axis: {
          x: {
              type: 'category',
              categories: xAxis,
              label: "Angles"
          },
          y: {
            label: "Count"
          }
      },
      title: {
        text: 'Fingers (Thumb-Index Angles),DM (Distal-Medial Angles), PM(Proximal-Medial Angles) only accurate frames are considered'
      }
  });
}


function resetStats(){
  times = [];
  thumbIndexAngleArrDis = [];
  thumbIndexAngleArrCon = [];
  distalMedialArr = [];
  frames = [];
  medialProximalArr = [];
  thumbIndexAngle = 0;
  maxAngle = -10;
  minAngle = 200;
  counter = 0;

  //Variables for speed detection
  prevtime = 0;
  timetaken = 0;
  firstFrame = true;
  cheatedTime = 0;
  startcheat = 0;
  alreadyCheating = false;
}