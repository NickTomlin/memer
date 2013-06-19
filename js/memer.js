define(function () {

  var memer = {};
  memer.frames = [];

  memer.sanity = function() {
    console.log("hello from memer");
    console.log(this);
  };

/**
 * VIDEO
 * Capture user video and output to specified <video> element
 */

 /* Check for UserMedia, error handling, crossBrowser config
=================================*/
memer.getVideo = function(destElem) {
  var localMediaStream;
  // cross browser support
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;

  navigator.getUserMedia({video: true}, function(stream) {
    destElem.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }, onFailSoHard);
};


/**
 * MEMER
 * Gathers source canvases,
 */

// require([gif, gif.worker.js])
  memer.gif = function() {
    return new GIF({
      workers: 2,
      quality: 10
    }).on('finished', memer.gifFinished);
  };


  // consider a "broadcast" method (which defaults to returning null?), that can be passed
  // a function()

  memer.gifFinished = function(blob) {
   var gif_image = document.createElement('img');
   console.log("finished!");
   gif_image.src = window.URL.createObjectURL(blob);
   document.querySelector('#result').appendChild(gif_image);
 };




  // how do we handle the event that there is just one canvas?
  memer.gatherFrames = function(){
    var canvas = 0;
    for (; canvas < canvases.length; canvas++){
      // fill with text
      canvasText(canvas);
      memer.gif.addFrame(canvases[canvas], {delay : 200});
      term.say('\t Stored added frame to gif.\n');
    }
    memer.gif.render();
  };

  memer.canvasText = function(canvas, length, height) {
      var x = length || 300;
      var y = height || 400;

      var gtx = canvas.getContext('2d');
      gtx.fillStyle = "#fff";
      gtx.font = "bold 40px Helvetica";
      gtx.textAlign = "center";
      // gtx.fontBaseline = "bottom";
      gtx.fillText("Gif. Peeps: " + x + " x " + y , x, y);
  };

  memer.snapshot = function () {
    if (localMediaStream) {
      var snapCanvas = document.createElement('canvas');
      var snapCtx = snapCanvas.getContext('2d');
      // height is required, otherwise gif.js will not add frame (does it tell us this? no)
      snapCanvas.height = video.videoHeight;
      snapCanvas.width = video.videoWidth;

      snapCtx.drawImage(video, 0, 0 );
      canvases.push(snapCanvas);

      term.say('Stored canvas snapshot.\n');
    }
  };

  return memer;
});
