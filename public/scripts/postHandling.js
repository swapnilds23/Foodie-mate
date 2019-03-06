//to count to number of likes
function count(image) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:2403/votes',
    success: function(data) {
      var b = 0;
      if (data) {
        for (var row in data) {
          // console.log(image);
          if (data[row].submissionId == image) {
            b = b + 1;
          }
        }
        $('#likeCount').text('');
        $('#likeCount').text(b);
      }
    }
  });
}

//code to open modal to display clicked image.
$(document).on('click', '.eventImg', function() {
  $('#commentModal').modal('show');
  var dataId = $(this).data("id");
  $.ajax({
    type: "GET",
    url: 'http://localhost:2403/submissions',
    success: function(data) {
      if (data) {
        for (var row in data) {
          if (data[row].id == dataId) {
            //To display food image.
            $('#div1').append('<img class ="centeImage" id="eventImg1" src="' + data[row].imgPath + '" alt="">');
            $('#myModalLabel3').append(data[row].name);
            var imgName = '<p id="name11" align="justify">' + data[row].name + '</p>';
            var imgDescription = '<p align="justify">' + data[row].description + '</p>';

            //To display image name.
            $('#div3').append(imgName);

            //To display image description
            $('#div4').append(imgDescription);

            var a = '<img id="like" src="./assets/2.png" />';
            $('#div7').append(a);

            //To display like button.
            $.ajax({
              type: "GET",
              url: 'http://localhost:2403/votes',
              success: function(data) {
                if (data.length > 0) {
                  for (var row in data) {
                    if ((data[row].submissionId == $('#name11').text()) && (data[row].userId == localStorage.uid)) {
                      $('#div7').empty();
                      var a = '<img id="newLike" data-id="' + data[row].id + '" src="./assets/1.png" />';
                      $('#div7').append(a);
                    }
                  }
                }
              }
            });

            //To display total like.
            count($('#name11').text());

            //To display all the comments.
            $.ajax({
              type: "GET",
              url: 'http://localhost:2403/comments',
              success: function(data) {
                var a = 0;
                if (data.length > 0) {
                  for (var row in data) {

                    if (data[row].commentId == $("#name11").text()) {
                      a = a + 1;
                      var comId = data[row].id;
                      var cancel = '<button data-id="' + comId + '" type="button" class="btn btn-sm pull-right" id="cls1">&times;</button><br/>';
                      var cmnt = '<p align="justify" id="data1"><b>' + data[row].userName + '</b><br/>' + data[row].content + '</p>';
                      var div = '<div id="eachComment">' + cancel + cmnt + '</div>';
                      $('#list-comments').append(div);
                    }
                  }
                  //To display total number of comments.
                  $('#commentCount').text(a);
                } else {
                  $('#commentCount').text(a);
                }

              }
            });
          }
        }
      }
    }
  });
});

// code to handle like button.
$(document).on('click', '#like', function() {
  if (localStorage.uid) {
    var imageID = $(this).data("id");
    $.ajax({
      type: "GET",
      url: 'http://localhost:2403/votes',
      success: function(data) {
        if (data.length > 0) {
          for (var row in data) {
            if (data[row].id != imageID) {
              var data = {};
              data['submissionId'] = $("#name11").text();
              data['userId'] = localStorage.uid;
              data['vote'] = 1;
              $.ajax({
                type: "POST",
                url: 'http://localhost:2403/votes',
                data: data,
                dataType: 'json',
                success: function(data) {
                  $.each(data, function(key, element) {
                    if (key == 'id') {
                      var val1 = element;
                      $('#div7').empty();
                      var a = '<img id="newLike" data-id="' + val1 + '" src="./assets/1.png" />';
                      $('#div7').append(a);
                    }
                  });
                  //To display total like.
                  count($('#name11').text());
                }
              });

            }
          }
        } else {
          var data = {};
          data['submissionId'] = $("#name11").text();
          data['userId'] = localStorage.uid;
          data['vote'] = 1;
          $.ajax({
            type: "POST",
            url: 'http://localhost:2403/votes',
            data: data,
            dataType: 'json',
            success: function(data) {
              $.each(data, function(key, element) {
                if (key == 'id') {
                  var val1 = element;
                  $('#div7').empty();
                  var a = '<img id="newLike" data-id="' + val1 + '" src="./assets/1.png" />';
                  $('#div7').append(a);
                }
                //To display total like.
                count($('#name11').text());
              });
            }
          });
        }
      }

    });
  }
});

//code to dislike the image.
$(document).on('click', '#newLike', function() {
  var newImgID = $(this).data("id");
  if (localStorage.uid) {

    $.ajax({
      type: "GET",
      url: 'http://localhost:2403/votes',
      success: function(data) {
        for (var row in data) {
          if (data[row].id == newImgID) {
            var getid = data[row].id;
            $.ajax({
              type: 'POST',
              url: 'http://localhost:2403/votes' + '/' + getid,
              data: {
                _method: 'DELETE'
              },
              success: function() {
                $('#div7').empty();
                var a = '<img id="like" src="./assets/2.png" />';
                $('#div7').append(a);
                //To display total like.
                count($('#name11').text());
              }
            });

          }
        }
      }
    });
  }
});

//-------------------------------------------------code to handle comment box-------------------------------------------
$(document).on('click', '#comments', function() {
  $('#commentBox').show();
  $('#commentBox').empty();
  if (localStorage.uid) {
    //Retrieving username using userId.
    $.ajax({
      type: "GET",
      url: 'http://localhost:2403/users',
      success: function(data) {
        if (data.length > 0) {
          for (var row in data) {
            if (data[row].id == localStorage.uid) {
              var name = data[row].username;
            }
          }
        }
        //Display textarea for user to write comment
        var form = '<form id="comment-form">';
        var inputBox = '<input  type="text" placeholder="Write a comment" id="input-comment" class="editor-content">';
        var finalTag = form + inputBox + '</form>';
        $('#commentBox').append(finalTag);

        //To Post comment on pressing enter key.
        $('#input-comment').keydown(function(event) {
          var keypressed = event.keyCode || event.which;
          if (keypressed == 13) {
            event.preventDefault();
            var cmntData = $("#input-comment").val();

            if (cmntData != '') {
              //-------------To add comment data into the comment collection-------------------
              var commentArray = {};
              commentArray['userName'] = name;
              commentArray['content'] = cmntData;
              commentArray['dateTime'] = new Date();
              commentArray['commentId'] = $("#name11").text();

              $.ajax({
                type: "POST",
                url: 'http://localhost:2403/comments',
                data: commentArray,
                dataType: 'json',
                success: function(data) {
                  $.each(data, function(key, element) {
                    if (key == 'id') {
                      var did = element;
                      // To display comment.
                      var cancel = '<button type="button" data-id="' + did + '"  class="btn btn-sm pull-right"  id="cls1">&times;</button>';
                      var cmnt = '<p align="justify" id="data1"><b>' + name + '</b>' + '<br/>' + cmntData + '</p>';
                      var div = '<div id="eachComment">' + cancel + cmnt + '</div>';
                      $('#list-comments').append(div);
                      // console.log(cancel);
                      //To display total number of comments.
                      var count = 1 + +($("#commentCount").text());
                      $('#commentCount').text(count);
                      $('#input-comment').val('');
                      // $('#commentBox').empty();
                      // $('#commentBox').hide();
                    }
                  });
                }
              });
              //----------------------------------------------------------------------------------
            }
          }
        });
      }
    });
  }
});

//------------------------------------------------------------code to delete comment---------------------------------
$(document).on('click', '#cls1', function() {
  var clsId = $(this).data("id");
  if (localStorage.uid) {
    //Retrieving username using userId.
    $.ajax({
      type: "GET",
      url: 'http://localhost:2403/users',
      success: function(data) {
        if (data.length > 0) {
          for (var row in data) {
            if (data[row].id == localStorage.uid) {
              var name = data[row].username;
            }
          }
        }

        // To delete comment from database.
        $.ajax({
          type: "GET",
          url: 'http://localhost:2403/comments',
          success: function(data) {
            if (data.length > 0) {
              for (var row in data) {

                if ((data[row].id == clsId) && (data[row].userName == name)) {
                  var getid = data[row].id;
                  $.ajax({
                    type: 'POST',
                    url: 'http://localhost:2403/comments' + '/' + getid,
                    data: {
                      _method: 'DELETE'
                    },
                    success: function() {
                      $('#list-comments').empty();
                      $.ajax({
                        type: "GET",
                        url: 'http://localhost:2403/comments',
                        success: function(data) {
                          var a = 0;
                          if (data.length > 0) {
                            for (var row in data) {

                              if (data[row].commentId == $("#name11").text()) {
                                a = a + 1;
                                var comId = data[row].id;
                                var cancel = '<button data-id="' + comId + '" type="button" class="btn btn-sm pull-right" id="cls1">&times;</button><br/>';
                                var cmnt = '<p align="justify" id="data1"><b>' + data[row].userName + '</b><br/>' + data[row].content + '</p>';
                                var div = '<div id="eachComment">' + cancel + cmnt + '</div>';
                                $('#list-comments').append(div);
                                // console.log(cancel);
                              }
                            }
                            //To display total number of comments.
                            $('#commentCount').text(a);
                          } else {
                            $('#commentCount').text(a);
                          }
                        }
                      });
                    }
                  });
                }
              }
            }
          }
        });
      }
    });
  }
});


//---------------------------------------------code to handle close modal button-----------------------------------
$('#commentModal').on('click', '#cls', function() {
  $('#div1').empty();
  $('#div3').empty();
  $('#div4').empty();
  $('#div5').empty();
  //var a='<img id="like"  src="./assets/2.png" />'
  $('#div7').empty();
  $('#list-comments').empty();
});

//code to handle click outside of modal.
$("#commentModal").click(function() {
  $(".modal").addClass("visible");
});

$("#commentModal").click(function() {
  $(".modal").removeClass("visible");
});

$("#commentModal").on('shown.bs.modal', function() {
  $('#div2').css('height', $('#div1').height());
  $('.content').css('height', $('#div2').height() - $('#div3').height() - $('#div4').height() - $('.likeCommentRow').height() - 48);
});

$('#commentModal').on('hide.bs.modal', function() {
  if (!localStorage.searchTerm) {
    localStorage.searchTerm = '';
  }
  searchReturn(localStorage.searchTerm);
});

$(document).click(function(event) {
  //if you click on anything except the modal itself or the "open modal" link, close the modal
  if (!$(event.target).closest(".modal,#commentModal").length) {
    $("body").find(".modal").removeClass("visible");
    $('#div1').empty();
    $('#div3').empty();
    $('#div4').empty();
    $('#div5').empty();
    $('#div7').empty();
    $('#list-comments').empty();
  }
});
