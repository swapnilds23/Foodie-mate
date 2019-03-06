/* eslint-disable */

(function(window) {
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;
  var SnackBar = App.SnackBar;

  function RemoteDataStore(url) {
    if (!url) {
      throw new Error('No remote URL supplied.');
    }

    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function(data) {
    $.ajax({
      url: this.serverUrl + 'users',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function() {
        $('#signupModal').modal('hide');
        var message = 'You have signed up successfully. Please login to access core application features.';
        var snack = new SnackBar(message);
        snack.displayMessage(4800);
      },
      error: function(error) {
        Error(error);
      }
    });
  };

  // Check if user is autheticated
  RemoteDataStore.prototype.authenticate = function(data) {
    $.ajax({
      url: this.serverUrl + 'users/login',
      type: 'POST',
      data: data,
      success: function(response) {
        $('#loginmessage').hide();
        localStorage.setItem("uid", response.uid);
        localStorage.setItem("isLoggedin", response.id);
        $('#loginModal').modal('hide');
        $('#loginbutton').hide();
        $('#signupbutton').hide();
        $('#logoutbutton').show();
        $('#addSubmission').show();
        $('#myfoodbutton').show();
        location.reload();
        var message = 'You have logged in successfully.';
        var snack = new SnackBar(message);
        snack.displayMessage(4800);
      },
      error: function(error) {
        var message = 'Could not log you in. Please check your credentials.';
        var snack = new SnackBar(message);
        snack.displayMessage(4800);
      }
    });
  };

  // Get current user from local storage if set
  RemoteDataStore.prototype.getCurrentUser = function() {
    var currUid = localStorage.uid;
    if (!currUid) {
      Error('Some issue with getting current user token');
    } else {
      return currUid;
    }
  }

  App.RemoteDataStore = RemoteDataStore;
  window.App = App;

})(window);
