$(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var formAction = $("#reserveFormStep3").attr("action");
  $("#reserveFormStep3").attr(
    "action",
    formAction + "&requestID=" + urlParams.get("requestID")
  );

  var backStep = $("a#backStep").attr("href");
  $("a#backStep").attr(
    "href",
    backStep + "&requestID=" + urlParams.get("requestID")
  );

  var tommorrow = new persianDate().add("days", 1);
  var str = tommorrow.year() + "-" + tommorrow.month() + "-" + tommorrow.date();
  $("#datepicker").attr("value", str);

  $("#datepicker").pDatepicker({
    initialValue: true,
    initialValueType: "persian",
    format: "dddd, DD MMMM YYYY",
    autoClose: true,
    minDate: new persianDate().add("days", 1),
    altField: "#datepickerValue"
    // format: "dddd, MMMM DD YYYY, h:mm:ss a",
  });

  var isSent = false;

  $("#reserveFormStep3").submit(function() {
    if (!isSent) {
      var placeID = $("input[name=placeID]:checked").val();
      var dateToReserve = new persianDate().unix(
        parseInt($("#datepickerValue").val() / 1000)
      );
      dateToReserve = {
        year: dateToReserve.year(),
        month: dateToReserve.month(),
        date: dateToReserve.date()
      };

      var timeToReserve = {
        hourFrom: parseInt($(".hourFrom#hf" + placeID).val()),
        minFrom: parseInt($(".minFrom#mf" + placeID).val()),
        hourTo: parseInt($(".hourTo#ht" + placeID).val()),
        minTo: parseInt($(".minTo#mt" + placeID).val())
      };

      $.post(
        "/reserveProc/checkReservedTimes",
        { placeID, dateToReserve, timeToReserve },
        function(data) {
          $(".wrongTime").text("");
          if (!data.reserved && !data.wrongTime) {
            isSent = true;
            var dateToReserve = new persianDate().unix(
              parseInt($("#datepickerValue").val() / 1000)
            );
            $("form")
              .append(
                '<input type="hidden" name="year" value="' +
                  dateToReserve.year() +
                  '" />'
              )
              .append(
                '<input type="hidden" name="month" value="' +
                  dateToReserve.month() +
                  '" />'
              )
              .append(
                '<input type="hidden" name="date" value="' +
                  dateToReserve.date() +
                  '" />'
              );
            var placeID = $("input[name=placeID]:checked").val();
            $(".hourFrom#hf" + placeID).attr("name", "hourFrom");
            $(".minFrom#mf" + placeID).attr("name", "minFrom");
            $(".hourTo#ht" + placeID).attr("name", "hourTo");
            $(".minTo#mt" + placeID).attr("name", "minTo");
            $("#reserveFormStep3").submit();
          } else {
            $(".wrongTime").text("");
            var placeID = $("input[name=placeID]:checked").val();

            $("#wt" + placeID).text(
              data.reserved ? "رزرو شده است" : "زمان اشتباه"
            );
          }
        }
      );
    }

    return isSent;
  });
});
