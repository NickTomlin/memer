requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "components": "/components",
      "src": "/js/src"
    }
});

// Load the main app module to start the app
requirejs(["gif/gif",  "gif/gif.worker", "src/terminal","src/memer"], function(gif, gifworker, terminal, memer){

  termEle = document.getElementById('terminal');
  var term = new Terminal(termEle);
  term.say('foo');

  /**
   * Check to see if UA supports getUserMedia
   * @return {Boolean} [description]
   */
  function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (hasGetUserMedia()) {
    term.say('User media is a go.');
    /*
    This is getting gnarsty. How to initialize all this shit?
    */
  // var video = getVideo(document.querySelector('video'));

  // var captureButton = document.getElementById('start_capture');
  // captureButton.addEventListener('click', getVideo, false);

  // // Video function
  // video.addEventListener('click', memer.snapshot, false);

  // var doneButton = document.getElementById('render');
  // doneButton.addEventListener('click', memer.gatherFrames); // render gif when user clicks button
  } else {
    term.say("Sorry, your browser does not support getUserMedia. To join in on the fun, use one that does");
  }
});// requireJs
