requirejs.config({
    "baseUrl": "js",
    "paths": {
      "gif": "lib/gif/gif",
      "lodash": "vendor/lodash/dist/lodash.underscore.min"
    }
});

define("require-config", function(){});

requirejs(['require-config'], function () {

// Load the main app module to start the app
require(["lodash" ,  "memer"], function(_, memer){
  contentEle = document.getElementById('content');

  if ( memer.hasGetUserMedia() ) {
    var yayText = document.querySelector('.yay');
    yayText.classList.toggle('is-hidden');

    var buttonStart = document.getElementById('start');
    buttonStart.addEventListener('click', function(){
      memer.init(contentEle);
      yayText.classList.toggle('is-hidden');
    });
  } else {
    nayText = document.querySelector('.nay');
    nayText.classList.toggle('is-hidden');
  }

});
});