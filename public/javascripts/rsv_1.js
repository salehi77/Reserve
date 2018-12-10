$(function() {
  setRequestID = false;
  $("form").submit(function() {
    academic = $("input[name=academic]:checked").val();
    if (academic) {
      if (!setRequestID) {
        $.get("/submit-request", function(data) {
          $("form").attr("action", "rsv?step=2&requestID=" + data.requestID);
          setRequestID = true;
          $("form").submit();
        });
      }
      return setRequestID;
    } else {
      $("#err_msg").text("نوع درخواست انتخاب نشده است");
      return false;
    }
  });
});
