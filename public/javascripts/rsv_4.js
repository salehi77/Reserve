$(function() {
  var urlParams = new URLSearchParams(window.location.search);

  var backStep = $("a#backStep").attr("href");
  console.log(backStep);
  $("a#backStep").attr(
    "href",
    backStep + "&requestID=" + urlParams.get("requestID")
  );
});
