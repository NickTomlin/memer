requirejs.config({
    // "baseUrl": "js",
    "paths": {
      "components": "/components",
      "lib": "/js/lib"
    }
});

// Load the main app module to start the app
requirejs(["lib/gif/gif", "terminal","memer"], function(gif, terminal, memer){
  contentEle = document.getElementById('content');
  memer(contentEle);
});// requireJs
