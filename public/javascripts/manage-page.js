$(function() {
  $("button#addplace").click(function() {
    $("div#addingPlace").css("display", "block");

    $("#createPlace").click(function() {
      if ($("#name").val() == "") {
        $("#name").css("border", "1px solid red");
        return;
      }
      if ($("#capacity").val() == "") {
        $("#capacity").css("border", "1px solid red");
        return;
      }
      $("#name").css("border", "");
      $("#capacity").css("border", "");

      var urlParams = new URLSearchParams(window.location.search);

      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("x-auth", urlParams.get("auth"));
        },
        url: "/manage/addPlace",
        data: {
          name: $("#name").val(),
          type: $("#selectType").val(),
          projector: $("#projectorID:checked").val(),
          computer: $("#computerID:checked").val(),
          board: $("#boardID:checked").val(),
          wifi: $("#wifiID:checked").val(),
          capacity: $("#capacity").val()
        },
        success: function(msg) {
          console.log(msg);
          if (!msg.error) {
            $("div#addingPlace").css("display", "none");
            $("span#message")
              .css("color", "green")
              .css("font-size", 24)
              .css("font-weight", "bold")
              .text("فضا ایجاد شد!");
          } else {
            $("span#message")
              .css("color", "red")
              .css("font-size", 24)
              .css("font-weight", "bold")
              .text("دوباره تلاش کنید!");
          }
        }
      });
    });
  });
});
