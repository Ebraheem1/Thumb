

export var Leap = require('leapjs');
export var currentFrame;

var options = {
    background: true,
    useAllPlugins: true,
    enableGestures: true
};


var controller = Leap.loop(options, function(frame)
{
    currentFrame = frame;
});
