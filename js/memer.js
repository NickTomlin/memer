define(
  ['gif','lodash'],
  Memer = function(gif, _) {

    var
    content,
    localMediaStream,
    shutterSpeed = 150, // encapsulate in an options object later
    videoEle, // we could eventually have this be a callback that receives a video element, or the internal getVideo function
    snapTimer,
    inputText,
    buttonCreate,
    buttonStop,
    canvases = [],
    // functions
    log = function(message){ window.console.log(message); }
    ;


  /* ==========================================================================
     Public Functions
     ========================================================================== */
  /**
   * Check to see if UA supports getUserMedia
   * @return {Boolean}
   */
  function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  function init (contentEle) {
    content = contentEle;
    videoEle = getVideo();

    // cross browser support
    window.URL = window.URL || window.webkitURL; navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({video: true}, function(stream) {
      videoEle.src = window.URL.createObjectURL(stream);
      videoEle.localMediaStream = stream;
      content.appendChild(videoEle);

      attachControls();
      log("Begin Video Capture");
    }, function(e){ console.log(e); return; }); // bug out
  }


  /* ==========================================================================
     Private Functions
     ========================================================================== */

  function attachControls () {

      // text
      inputText = document.createElement('input');
      inputText.setAttribute('type','text');
      inputText.value = "Gif. Baby...";
      inputText.width = 80;
      inputText.height = 24;
      content.appendChild(inputText);

      // timing
      inputDuration = document.createElement('input');
      inputDuration.id = "duration";


      inputDuration.setAttribute('type', 'range'); // this will have no effect in browsers that do not support the given type
      inputDuration.setAttribute('placeholder', 'Length of gif (1-10)');
      if (inputDuration.type !== "text") {
        inputDuration.classList.add('input-range');
        inputDuration.setAttribute('min', 1);
        inputDuration.setAttribute('max', 10);
        inputDuration.setAttribute('step', 1);
      } else {
        inputDuration.value = "4";
        inputDuration.style.width = "16px";
      }
      content.appendChild(inputDuration);

      // start
      buttonStart = document.createElement('button');
      buttonStart.addEventListener('click', captureVideo); // render gif
      buttonStart.classList.add('affirmative');
      buttonStart.innerHTML = "Start video";
      content.appendChild(buttonStart);

      // stop
      buttonStop = document.createElement('button');
      buttonStop.innerHTML = "Stop Capture";
      buttonStop.classList.add('negatory');
      buttonStop.disabled = true;
      buttonStop.addEventListener('click', stopCapture);
      content.appendChild(buttonStop);
  }


  function stopCapture () {
    if(snapTimer) {
      clearInterval(snapTimer);
    }

    buttonStop.disabled = true;
    gatherFrames();
  }


  function gifFinished (blob) {
     var gif_image = document.createElement('img');
     gif_image.src = window.URL.createObjectURL(blob);
     content.appendChild(gif_image);
     gif = null; // attempt to offer gif up for garbage collection

     console.log(gif);
     buttonStart.disabled = false;
  }


  function captureVideo () {
    canvases = [];
    var start = Date.now();

    var duration = inputDuration.value && inputDuration.value >= 1 && inputDuration.value <= 10 ? inputDuration.value * 1000 : 4000;
    console.log(duration);

    this.disabled = true; // refers to evented element (a button, in this case). This could get sticky...
    buttonStop.disabled = false;

    snapTimer = setInterval(function(){
      now = Date.now();
      if (now  - start >= duration){
        stopCapture();
      }
      snapshot(videoEle);
    }, shutterSpeed);
  }


 function gatherFrames () {
    gif = new GIF({
      workers: 3,
      quality: 7
    }).on('finished', gifFinished);

    var canvas = 0;
    for (; canvas < canvases.length; canvas++){
      // fill with text
      textToCanvas(canvases[canvas], inputText.value);
      gif.addFrame(canvases[canvas], {delay : 100});
      log('\t Stored added frame to gif.\n'); // @fix
    }
    gif.render(); // @fix
  }


  /**
   * take a "snapshot" of an image or video and store
   * it to a canvas
   * @param  {img/video element}
   * @return {canvas element}
   */
  function snapshot (src) {
      var snapCanvas = document.createElement('canvas');
      var snapCtx = snapCanvas.getContext('2d');
      // height is required, otherwise gif.js will not add frame (does it tell us this? no)
      snapCanvas.height = 280;
      snapCanvas.width = 280;

      snapCtx.drawImage(videoEle, 0, 0, snapCanvas.height, snapCanvas.width);
      console.log("snap!");

      canvases.push(snapCanvas);
  }


/**
 * VIDEO
 * Capture user video and output to specified <video> contentEle
 */
  function getVideo () {
    var videoEle = document.createElement('video');
    /*
      Only chrome supports video constraints at the moment. So setting these do not matter
     */
    // videoEle.width = 640;
    // videoEle.height = 480;
    videoEle.autoplay = "true";

    return videoEle;
  }


  /**
  * Write text on to canvas.
  */
   function textToCanvas (canvas, message, length, height) {
      var x = canvas.width / 2;
      var y = canvas.height - (canvas.height / 6);
      var text = message || "Gif. Peeps: ";

      var gtx = canvas.getContext('2d');

      gtx.fillStyle = "#fff";
      gtx.font = "bold 22px Helvetica";
      gtx.textAlign = "center";
      // gtx.fontBaseline = "bottom";

      gtx.fillText(text, x, y);
  }


  /* ==========================================================================
     Expose public functions
     ========================================================================== */
  return {
    init : init,
    hasGetUserMedia: hasGetUserMedia
  };
}); // define closure