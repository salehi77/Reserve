$(function() {
  setRequestID = false;
  $("#reserveFormStep1").submit(function() {
    if (!setRequestID) {
      academic = $("input[name=academic]:checked").val();
      if (academic) {
        $.get("/reserveProc/submit-request", function(data) {
          if (!data.error) {
            var formAction = $("form").attr("action");
            $("#reserveFormStep1").prop(
              "action",
              formAction + "&requestID=" + data.requestID
            );

            setRequestID = true;
            $("#reserveFormStep1").submit();
          } else {
            console.error(data.error);
          }
        });
      } else {
        $("#err_msg").text("نوع درخواست انتخاب نشده است");
        return false;
      }
    }

    return setRequestID;
  });
});
