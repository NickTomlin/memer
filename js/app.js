requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "components": "/components"
    }
});

// Load the main app module to start the app
requirejs(["gif/gif", "gif/gif.worker", "test/test","components/test_component/bar"], function(gif, gifworker, test, component_test){

  /* Sanity
  =================================*/
   // test that our custom lib imports are working
   console.log(test.myMethod(2));
   // test that our custom components are working
   console.log(component_test.sayHello("bob"));

  /* ==========================================================================
     Capture User Video
     ========================================================================== */

   /* does user have getUserMedia capabilities?
   =================================*/
   function hasGetUserMedia() {
     // Note: Opera is unprefixed.
     return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia || navigator.msGetUserMedia);
   }

   if (hasGetUserMedia()) {
      document.querySelector('#terminal').innerHTML += '\n can has user media';
   } else {
     document.querySelector('#terminal').innerHTML += 'getUserMedia() is not supported in your browser ';
   }


   /* ==========================================================================
      Create a Gif
      ========================================================================== */

   var camera_gif = new GIF({
     workers: 2,
     workerFile: gifworker,
     quality: 10
   });

   // add a image element
   var one = document.getElementById('one');
   var two = document.getElementById('two');

   camera_gif.addFrame(one);
   camera_gif.addFrame(two, {delay: 200});

   // or a canvas element
   // camera_gif.addFrame(canvasElement, {delay: 200});

   // or copy the pixels from a canvas context
   // camera_gif.addFrame(ctx, {copy: true});

   // check that gif is generating a new element
   console.log(camera_gif);

   var gif_image = document.createElement('img');

   camera_gif.on('finished', function(blob) {
    console.log("finished!");
    console.log(blob);
     // window.open(URL.createObjectURL(blob));
     gif_image.src = URL.createObjectURL(blob);
     document.querySelector('#result').appendChild(gif_image);
   });

   camera_gif.render();
});
