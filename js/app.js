requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "components": "/components"
    }
});

// Load the main app module to start the app
requirejs(["gif/gif", "gif/gif.worker", "test/test","components/test_component/bar"], function(gif, gifworker, test, component_test){

  /* Sanity Check for require imports
  =================================*/
   // test that our custom lib imports are working
   console.log(test.myMethod(2));
   // test that our custom components are working
   console.log(component_test.sayHello("bob"));

  /* Communication With User
  =================================*/
   term = document.querySelector('#terminal');
   term.say = function(message){
    this.innerHTML +=  message + "\n";
   };

  /* ==========================================================================
     Check for UserMedia, error handling, crossBrowser config
     ========================================================================== */

   /* does user have getUserMedia capabilities?
   =================================*/
   function hasGetUserMedia() {
     // Note: Opera is unprefixed.
     return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia || navigator.msGetUserMedia);
   }

   if (hasGetUserMedia()) {
     term.say('can has user media');
   } else {
     term.say('getUserMedia() is not supported in your browser ');
   }

   /* Failure  handling T_T
   =================================*/
   var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };


  // cross browser support
   window.URL = window.URL || window.webkitURL;
   navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia || navigator.msGetUserMedia;

/* ==========================================================================
   Initialize Gif and media Elements (wrap this in it's own function, dependent on getUserMedia support)
   ========================================================================== */
  /* Gif Object
  =================================*/
  camera_gif = new GIF({
    workers: 2,
    workerFile: gifworker,
    quality: 10
  });

  // how do we handle the event that there is just one canvas?
  camera_gif.gather_frames = function(){
    var elements = document.querySelectorAll('canvas');
    var canvas = 0;
    for (; canvas < elements.length; canvas++){
      camera_gif.addFrame(elements[canvas], {delay : 200});
      terminal.innerHTML += '\t Stored added frame to gif.\n';
    }
    console.log(this);
    camera_gif.render();
  };

  /* Video
  =================================*/
  var video = document.querySelector('video');
  //var canvas = document.querySelector('canvas');
  //var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  /* Render finished gif
  =================================*/
  var doneButton = document.getElementById('render');
  doneButton.addEventListener('click', camera_gif.gather_frames); // render gif when user clicks button

  // when render event fires (after user has clicked finished)
  // create a new gif element and set it's src to the blog
  camera_gif.on('finished', function(blob) {
   var gif_image = document.createElement('img');
   console.log("finished!");
   gif_image.src = window.URL.createObjectURL(blob);
   document.querySelector('#result').appendChild(gif_image);
  });

  /* Start Video
  =================================*/
  var captureButton = document.getElementById('start_capture');

  // Not showing vendor prefixes or code that works cross-browser.
  var getMedia = function () {
    navigator.getUserMedia({video: true}, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
    }, onFailSoHard);
  };

  captureButton.addEventListener('click', getMedia, false);


  /* Grab a frame in video, add to gif
  =================================*/
  video.addEventListener('click', snapshot, false);

  function snapshot() {
    if (localMediaStream) {
      var snapCanvas = document.createElement('canvas');
      var snapCtx = snapCanvas.getContext('2d');
      snapCanvas.height = video.videoHeight;
      snapCanvas.width = video.videoWidth;
      snapCtx.drawImage(video, 0, 0 );
      document.body.appendChild(snapCanvas);

      // ctx.drawImage(canvas, 0, 0);
      // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
      // ganky.....
      //var snap = document.createElement('img');
      //snap.src = video.src;
      terminal.innerHTML += 'Stored canvas snapshot to dom.\n';
    }
  }






   /* ==========================================================================
      Create a Gif
      ========================================================================== */

   // function createGifs() {
   //  console.log('createGifs fired!');

    /*  Ways to gather gif:
     // add a image element
     // var one = document.getElementById('one');
     // var two = document.getElementById('two');

     // camera_gif.addFrame(one);
     // camera_gif.addFrame(two, {delay: 200});

     // or a canvas element
     // camera_gif.addFrame(canvasElement, {delay: 200});

     // or copy the pixels from a canvas context
     // camera_gif.addFrame(ctx, {copy: true});
     */

     // check that gif is generating a new element

     // }

});// requireJs
