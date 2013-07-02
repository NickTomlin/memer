requirejs.config({
    "baseUrl": "js",
    "paths": {
      "components": "../components",
      "gif": "lib/gif/gif",
      "gifWorker": "lib/gif/gif.worker",
      "lodash": "../components/lodash/dist/lodash.underscore.min"
    }
});

// Load the main app module to start the app
requirejs(["lodash" , "terminal", "memer"], function(_, terminal, memer){
  contentEle = document.getElementById('content');

  if ( memer.hasGetUserMedia() ) {
    var yayText = document.querySelector('.yay');
    yayText.classList.remove('is-hidden');
    yayText.classList.add('is-visible'); // this is why you use libraries :\

    var buttonStart = document.getElementById('start');
    buttonStart.addEventListener('click', function(){
      memer.init(contentEle);
    });
  } else {
    document.write('fail');
  }

});// requireJs
