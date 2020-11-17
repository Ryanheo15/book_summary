
$(document).ready(() => {

  $(".form-control").change((e) => {
    $(e.target).addClass("is-valid");
  });

  $("#bookFile").change(() => {
    let bookFile = $("#bookFile").val();
    $("#bookLabel").html(bookFile);
    $("#bookFile").addClass("is-valid");
  });

  $("#bookImgFile").change(() => {
   let imgFile = $("#bookImgFile").val();
   $("#imgLabel").html(imgFile);

   $("#bookImgFile").addClass("is-valid");
  });

});
