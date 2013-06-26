/**
 * TERMINAL
 * Communicate with user through HTML element
 * @param {DOM node}
 */
var terminal = (function(elem){
  var target = elem;

  return {
    say: function(message){
      target.innerHTML += message + '\n';
    },
    clear: function(){
      target.innerHTML = "";
    }
  };
});