$(document).on('click', '.editable', function() {
  var attachedId = $(this).data('id');
  $('#editSubmissionModal').modal('toggle');
  $.ajax({
    type: "GET",
    url: 'http://localhost:2403/submissions/' + attachedId,
    success: function(data) {
      this.imgPath = data.imgPath;
      this.name = data.name;
      this.tags = data.tags;
      this.desc = data.description;
      this.subid = data.id;
    }.bind(this),
    error: function(error) {
      Error(error);
    }
  });
  $('#editSubmissionModal').on('shown.bs.modal', function() {
    $('#imagePreview1').css('background-image', 'url(' + this.imgPath + ')');
    $('#name1').val(this.name);
    $('#tags1').val(this.tags);
    $('#description1').val(this.desc);
    $('#submission1').attr('data-id', this.subid);
  }.bind(this));
});
