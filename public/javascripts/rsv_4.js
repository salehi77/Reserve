$(function() {
  var urlParams = new URLSearchParams(window.location.search);

  $("#backStep").attr(
    "href",
    "rsv?step=3&requestID=" + urlParams.get("requestID")
  );
});
