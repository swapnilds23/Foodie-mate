var searchReturn = function(que) {
  if (!que) {
    que = '';
  }
  var searchQuery = que;

  $.ajax({
    type: "GET",
    url: 'http://localhost:2403/submissions',
    success: function(data) {
      if (data) {
        //empty the gallery
        $('#eventsGallery').empty();
        var $container = $('<div></div>', {
          'class': 'thumbnail-list'
        });
        var lowerQuery = searchQuery.toLowerCase();

        for (var row in data) {
          var lowerDataName = '';

          //if the query is the user's id in localStorage, use that as the term
          //else, use the submission name
          if (localStorage.uid && localStorage.uid.toLowerCase() == lowerQuery) {
            lowerDataName = data[row].userId.toLowerCase();
          } else {
            lowerDataName = data[row].name.toLowerCase();
          }

          //if match in the name, append image to gallery and continue
          if (lowerDataName.includes(lowerQuery)) {
            var images = '<div class="col-md-3"><div class="thumbnail"> <div class="foodImg"><img data-id="' + data[row].id + '" class="eventImg" src="' + data[row].imgPath + '" alt=""></div>';
            var buttonLike = '';
            var buttonComment = '';
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
                  $('#lk1').text('');
                  $('#lk1').text(b);
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
                  $('#ck1').text('');
                  $('#ck1').text(b);
                  // console.log(data[row].name);
                }
              }
            });
            var buttonEdit = '';
            if (localStorage.uid) {
              buttonLike = '<a href="#" class="btn btn-info btn-xs" role="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span><span id="lk1"></span></a>';
              buttonComment = '<a href="#" class="btn btn-default btn-xs" role="button"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span><span id="ck1"></span></a>';
              if (localStorage.uid == data[row].userId) {
                buttonEdit = '<a href="#" data-id=' + data[row].id + ' class="btn btn-default btn-xs editable" role="button"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
              }
            }
            var name = '<div class="foodCaption"><span class="imgName">' + data[row].name + '</span><span class="likeComment">' + buttonLike + buttonComment + buttonEdit + '</span></div>';
            $('#eventsGallery').append(images + name);
            continue;
          }

          for (var tag in data[row].tags) {
            //if match in tags, append image to gallery and break (to avoid duplicates for dupe tags)
            var lowerTagName = data[row].tags[tag].toLowerCase();
            if (lowerTagName.includes(lowerQuery)) {
              var images = '<div class="col-md-3"><div class="thumbnail"> <div class="foodImg"><img data-id="' + data[row].id + '" class="eventImg" src="' + data[row].imgPath + '" alt=""></div>';
              var buttonLike = '';
              var buttonComment = '';
              var buttonEdit = '';
              if (localStorage.uid) {
                buttonLike = '<a href="#" class="btn btn-info btn-xs" role="button"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span></a>';
                buttonComment = '<a href="#" class="btn btn-default btn-xs" role="button"><span class="glyphicon glyphicon-comment" aria-hidden="true"></span></a>';
                if (localStorage.uid == data[row].userId) {
                  buttonEdit = '<a href="#" data-id=' + data[row].id + ' class="btn btn-default btn-xs editable" role="button"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }
              }
              var name = '<div class="foodCaption"><span class="imgName">' + data[row].name + '</span><span class="likeComment">' + buttonLike + buttonComment + buttonEdit + '</span></div>';
              $('#eventsGallery').append(images + name);
              break;
            }
          }
        }

        $('#eventsGallery').append($container);
      }
    }
  });
};


//Handle clicking "search"
$('#searchButton').on('click', function() {
  localStorage.searchTerm = '';
  var App = window.App || {};
  var SnackBar = App.SnackBar;
  var searchInput = document.getElementById("searchItems");
  var searchQuery = searchInput.value;

  var re = /^([A-z]{3,}\s?)*$/;
  if (!re.test(searchQuery)) {
    var message = "Search term must be at least 3 letters. No numbers or special characters.";
    var snack = new SnackBar(message);
    snack.displayMessage(4800);
  } else {
    localStorage.searchTerm = searchQuery.toLowerCase();
    searchInput.setCustomValidity("");
    searchReturn(localStorage.searchTerm);
  }
});

//Handle enter key
$('#searchItems').keypress(function(e) {
  if (e.which == 13) {
    localStorage.searchTerm = '';
    var App = window.App || {};
    var SnackBar = App.SnackBar;
    var searchInput = document.getElementById("searchItems");
    var searchQuery = searchInput.value;

    var re = /^([A-z]{3,}\s?)*$/;
    if (!re.test(searchQuery)) {
      var message = "Search term must be at least 3 letters. No numbers or special characters.";
      var snack = new SnackBar(message);
      snack.displayMessage(4800);
    } else {
      localStorage.searchTerm = searchQuery.toLowerCase();
      searchInput.setCustomValidity("");
      searchReturn(localStorage.searchTerm);
    }
    return false;
  }
});

//Handle clicking "My Food"
$('#myfoodbutton').on('click', function() {
  searchReturn(localStorage.uid.toLowerCase());
});
