requirejs.config({
    // "baseUrl": "js",
    "paths": {
      "components": "/components",
      "lib": "/js/lib"
    }
});

// Load the main app module to start the app
requirejs(["lib/gif/gif",  "lib/gif/gif.worker", "terminal","memer"], function(gif, gifworker, terminal, memer){
  contentEle = document.getElementById('content');

  if (memer.hasGetUserMedia()) {
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
