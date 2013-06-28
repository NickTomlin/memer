requirejs.config({
    // "baseUrl": "js",
    "paths": {
      "components": "/components",
      "lib": "/js/lib"
    }
});

// Load the main app module to start the app
requirejs(["lib/gif/gif",  "lib/gif/gif.worker", "terminal","memer"], function(gif, gifworker, terminal, memer){
  // removed terminal, because JS is confusing T_T

  contentEle = document.getElementById('content');
  memer(contentEle);

});// requireJs
