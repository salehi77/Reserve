$(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var formAction = $("form").attr("action");
  $("#reserveFormStep2").attr(
    "action",
    formAction + "&requestID=" + urlParams.get("requestID")
  );

  var backStep = $("a#backStep").attr("href");
  $("a#backStep").attr(
    "href",
    backStep + "&requestID=" + urlParams.get("requestID")
  );

  var isSend = false;
  $("#reserveFormStep2").submit(function() {
    $.post(
      "/reserveProc/checkUser",
      {
        username: $("#username").val(),
        password: $("#password").val()
      },
      function(data) {
        if (!data.error && data.message === "auth") {
          isSend = true;
          $("#reserveFormStep2").submit();
        } else {
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("خطا در ورود!");
        }
      }
    );

    return isSend;
  });
});
