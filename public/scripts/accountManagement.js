(function(window) {
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;

  function AccountMgmt(element) {
    if (element) {
      this.$logoutElement = $(element);
      AccountMgmt.prototype.addLogoutHandler = function() {
        this.$logoutElement.on("click", function() {
          localStorage.clear();
          $('#loginbutton').show();
          $('#signupbutton').show();
          $('#myfoodbutton').hide();
          $('#logoutbutton').hide();
          $('#addSubmission').hide();
          location.reload();
        });
      };
    }
  }

  AccountMgmt.prototype.addInititalLoadHandler = function() {
    if (localStorage.isLoggedin) {
      $('#loginbutton').hide();
      $('#signupbutton').hide();
      $('#myfoodbutton').show();
      $('#logoutbutton').show();
      $('#addSubmission').show();
    } else {
      $('#loginbutton').show();
      $('#signupbutton').show();
      $('#myfoodbutton').hide();
      $('#logoutbutton').hide();
      $('#addSubmission').hide();
    }

    $.ajax({
      type: "GET",
      url: 'http://localhost:2403/submissions',
      success: function(data) {
        if (data) {
          for (var row in data) {
            var images = '<div class="col-md-3"><div class="thumbnail"> <div class="foodImg"><img data-id="' + data[row].id + '" class="eventImg" src="' + data[row].imgPath + '" alt=""></div>';
            var buttonLike = '';
            var buttonComment = '';
            var buttonEdit = '';
            if (localStorage.uid) {
              buttonLike = '<a href="#" "data-name=' + data[row].name + '" class="btn btn-info btn-xs" role="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span><span id="lk"></span></a>';
              buttonComment = '<a href="#" "data-name=' + data[row].name + '" class="btn btn-default btn-xs" role="button"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span><span id="ck"></span></a>';
              var reqName = data[row].name;
              $.ajax({
                type: "GET",
                url: 'http://localhost:2403/votes',
                success: function(datas) {
                  var b = 0;
                  if (datas) {
                    for (var row in datas) {
                      if (datas[row].submissionId == reqName) {
                        b = b + 1;
                      }
                    }
                    //$('#lk').text('');
                    $('#lk').text(b);
                    // console.log(data[row].name);
                  }
                }
              });
              $.ajax({
                type: "GET",
                url: 'http://localhost:2403/comments',
                success: function(datas) {
                  var b = 0;
                  if (datas) {
                    for (var row in datas) {
                      if (datas[row].commentId == reqName) {
                        b = b + 1;
                      }
                    }
                    //$('#lk').text('');
                    $('#lk').text(b);
                    // console.log(data[row].name);
                  }
                }
              });
              if (localStorage.uid == data[row].userId) {
                buttonEdit = '<a href="#" data-id=' + data[row].id + ' class="btn btn-default btn-xs editable" role="button"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
              }
            }
            var name = '<div class="foodCaption"><span class="imgName">' + data[row].name + '</span><span class="likeComment">' + buttonLike + buttonComment + buttonEdit + '</span></div>';
            $('#eventsGallery').append(images + name);
          }
        }
      }
    });
  };

  App.AccountMgmt = AccountMgmt;
  window.App = App;

})(window);
