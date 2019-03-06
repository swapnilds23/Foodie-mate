(function(window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;
  var SnackBar = App.SnackBar;
  var AccountMgmt = App.AccountMgmt;
  var SnackBar = App.SnackBar;

  function FormHandler(selector) {
    if (!selector) {
      throw new Error("No selector provided");
    }

    this.$formElement = $(selector);
    if (this.$formElement.length === 0) {
      throw new Error("Could not find element with selector: " + selector);
    } else if (this.$formElement[0].id == "signupform") {

      FormHandler.prototype.addSubmitHandler = function(ds) {
        this.$formElement.on("submit", function(event) {
          event.preventDefault();
          var data = {};
          $(this).serializeArray().forEach(function(item) {
            data[item.name] = item.value;
          });
          data['username'] = data['username'].toLowerCase();
          this.reset();
          ds.add(data);
        });
      };

      FormHandler.prototype.addInputHandler = function() {
        this.$formElement.on("input", "[name='username']", function(event) {
          var username = event.target.value;
          var message = "";
          var re = /^(?=.*\d).{8,}$/;
          if (re.test(String(username).toLowerCase())) {
            event.target.setCustomValidity("");
          } else {
            message = "Username should be at least 8 characters with 1 digit.";
            event.target.setCustomValidity(message);
          }
        });

        this.$formElement.on("input", "[name='email']", function(event) {
          var emailAddress = event.target.value;
          var message = "";
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(String(emailAddress).toLowerCase())) {
            event.target.setCustomValidity("");
          } else {
            message = emailAddress + " is not an authorized email address.";
            event.target.setCustomValidity(message);
          }
        });

        this.$formElement.on("input", "[name='password']", function(event) {
          var password = event.target.value;
          var message = "";
          var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
          if (re.test(String(password))) {
            event.target.setCustomValidity("");
          } else {
            message = "Password should contain at least 8 characters with atleast 1 numeric character, 1 lowercase letter, 1 uppercase letter & 1 special character";
            event.target.setCustomValidity(message);
          }
        });

        this.$formElement.on("input", "[name='password2']", function(event) {
          var password = event.target.value;
          var message = "";
          if (password == $('#password')[0].value) {
            event.target.setCustomValidity("");
          } else {
            message = "Both passwords should match";
            event.target.setCustomValidity(message);
          }
        });
      };
    } else if (this.$formElement[0].id == "loginform") {
      FormHandler.prototype.addSubmitHandler1 = function(ds) {
        this.$formElement.on("submit", function(event) {
          event.preventDefault();
          var data = {};
          $(this).serializeArray().forEach(function(item) {
            data[item.name] = item.value;
          });
          var data1 = {};
          data1.username = data.loginemail1.toLowerCase();
          data1.password = data.loginpassword1;
          localStorage.setItem("username", $('#loginemail1').val());
          this.reset();
          ds.authenticate(data1);
        });
      };
    } else if (this.$formElement[0].id == "submissionform") {

      FormHandler.prototype.addMainImageHandler = function(element) {
        this.$imageElement = element;
        this.$imageElement.on("change", function() {
          var file1 = this.files[0];
          var imageType1 = file1.type;
          var imageSize1 = file1.size;

          // Check type
          var acceptableTypes = ["image/jpeg", "image/png", "image/jpeg"];
          var wrongType1 = ($.inArray(imageType1, acceptableTypes) == -1);
          if (wrongType1) {
            var message = 'Only jpeg, png and jpeg images are accepted.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          // Check size
          if (imageSize1 > 3 * 1024 * 1024) {
            var message = 'Please upload image less than 3MB.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
              $('#imagePreview').hide();
              $('#imagePreview').fadeIn(650);
            }.bind(this);
            reader.readAsDataURL(this.files[0]);
          }
        });
      };

      FormHandler.prototype.addSubmitHandler2 = function(ds) {
        this.$formElement.on("submit", function(event) {
          event.preventDefault();
          var file1 = $("#imageUpload")[0].files[0];
          if (!file1) {
            var message = 'Please upload a picture.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return;
          }

          var tagsRe = /^([A-z]{3,}\,?)+$/;
          if (!tagsRe.test(document.getElementById('tags').value)) {
            var message = "Must have at least 1 tag. " + "Tags must be at least 3 characters with no spaces.";
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          var data = {};
          var img = document.getElementById('imagePreview'),
            style = img.currentStyle || window.getComputedStyle(img, false),
            bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
          data['imgPath'] = bi;

          $(this).serializeArray().forEach(function(item) {
            data[item.name] = item.value;
          });

          data['tags'] = document.getElementById('tags').value.split(",");
          data['userId'] = localStorage.uid;
          data['dateTime'] = new Date();
          $.ajax({
            type: "POST",
            url: 'http://localhost:2403/submissions',
            data: data,
            dataType: 'json',
            success: function(data) {
              if (data) {
                var message = 'Your post has been added successfully.';
                var snack = new SnackBar(message);
                snack.displayMessage(4800);
                $("#submissionModal").modal('hide');
                $("#submissionform")[0].reset();
                $('#imagePreview').css('background-image', 'url(' + './assets/Blank_Pic.png' + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
                $("#eventsGallery").empty();
                var acctMgm = new AccountMgmt();
                acctMgm.addInititalLoadHandler();
              }
            }.bind(this),
            error: function(error) {
              Error(error);
            }
          });
        });
      };

    } else if (this.$formElement[0].id == "editSubmissionform") {
      FormHandler.prototype.addMainImageHandler1 = function(element) {
        this.$imageElement = element;
        this.$imageElement.on("change", function() {
          var file1 = this.files[0];
          var imageType1 = file1.type;
          var imageSize1 = file1.size;

          // Check type
          var acceptableTypes = ["image/jpeg", "image/png", "image/jpeg"];
          var wrongType1 = ($.inArray(imageType1, acceptableTypes) == -1);
          if (wrongType1) {
            var message = 'Only jpeg, png and jpeg images are accepted.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          // Check size
          if (imageSize1 > 3 * 1024 * 1024) {
            var message = 'Please upload image less than 3MB.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              $('#imagePreview1').css('background-image', 'url(' + e.target.result + ')');
              $('#imagePreview1').hide();
              $('#imagePreview1').fadeIn(650);
            }.bind(this);
            reader.readAsDataURL(this.files[0]);
          }
        });
      };

      FormHandler.prototype.addSubmitHandler3 = function(ds) {
        this.$formElement.on("submit", function(event) {
          event.preventDefault();
          var file1 = $("#imagePreview1").css('background-image');
          var id = $('#submission1')[0].dataset.id;
          if (!file1) {
            var message = 'Please upload a picture.';
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return;
          }

          var tagsRe = /^([A-z]{3,}\,?)+$/;
          if (!tagsRe.test(document.getElementById('tags1').value)) {
            var message = "Must have at least 1 tag. " + "Tags must be at least 3 characters with no spaces.";
            var snack = new SnackBar(message);
            snack.displayMessage(4800);
            return false;
          }

          var data = {};
          var img = document.getElementById('imagePreview1'),
            style = img.currentStyle || window.getComputedStyle(img, false),
            bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
          data['imgPath'] = bi;

          $(this).serializeArray().forEach(function(item) {
            data[item.name] = item.value;
          });
          // console.log(data);
          data['name'] = data['name1'];
          // data['imgPath'] = data['imgPath1'];
          data['description'] = data['description1'];
          data['tags'] = document.getElementById('tags1').value.split(",");
          data['userId'] = localStorage.uid;
          data['dateTime'] = new Date();
          $.ajax({
            type: "POST",
            url: 'http://localhost:2403/submissions/' + id,
            data: data,
            dataType: 'json',
            success: function(data) {
              if (data) {
                var message = 'Your post has been edited successfully.';
                var snack = new SnackBar(message);
                snack.displayMessage(4800);
                $("#editSubmissionModal").modal('hide');
                $("#editSubmissionform")[0].reset();
                $('#imagePreview').css('background-image', 'url(' + './assets/Blank_Pic.png' + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
                $("#eventsGallery").empty();
                var acctMgm = new AccountMgmt();
                acctMgm.addInititalLoadHandler();
              }
            }.bind(this),
            error: function(error) {
              Error(error);
            }
          });
        });
      };

    }
  }

  App.FormHandler = FormHandler;
  window.App = App;

})(window);
