/**
 * TERMINAL
 * Communicate with user through HTML element
 * @param {DOM node} return
 */
function Terminal(element) {
  this.target = element;

  this.say = function(message){
   this.target.innerHTML +=  message + "\n";
  };

  this.clear = function() {
    this.target.innerHTML = "";
  };
}