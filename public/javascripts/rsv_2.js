$(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var formAction = $("form").attr("action");
  $("#reserveFormStep2").attr(
    "action",
    formAction + "&requestID=" + urlParams.get("requestID")
  );
});
