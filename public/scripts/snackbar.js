(function(window) {
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;

  function SnackBar(message) {
    if (!message) {
      throw new Error('No message supplied.');
    }

    this.message = message;
  }

  SnackBar.prototype.displayMessage = function(timeout) {
    var x = document.getElementById("snackbar");
    $('#snackbar').text(this.message);
    x.className = "";
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, timeout);
  };

  App.SnackBar = SnackBar;
  window.App = App;

})(window);
