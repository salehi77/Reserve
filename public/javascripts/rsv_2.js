$(function() {
  var urlParams = new URLSearchParams(window.location.search);
  $("form").attr(
    "action",
    "/rsv?step=3&requestID=" + urlParams.get("requestID")
  );
});
