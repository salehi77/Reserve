$(function() {
  var urlParams = new URLSearchParams(window.location.search);
  $("form").attr(
    "action",
    "/rsv?step=3&requestID=" + urlParams.get("requestID")
  );

  $("#backStep").attr(
    "href",
    "rsv?step=2&requestID=" + urlParams.get("requestID")
  );

  var tommorrow = new persianDate().add("days", 1);
  var str = tommorrow.year() + "-" + tommorrow.month() + "-" + tommorrow.date();
  $("#datepicker").attr("value", str);

  var d = $("#datepicker").pDatepicker({
    initialValue: true,
    initialValueType: "persian",
    format: "dddd, DD MMMM YYYY",
    autoClose: true,
    minDate: new persianDate().add("days", 1),
    altField: "#datepickerValue"
    // format: "dddd, MMMM DD YYYY, h:mm:ss a",
  });

  $("form").submit(function() {
    var placeID = $("input[name=placeID]:checked").val();
    var dateToReserve = new persianDate().unix(
      parseInt($("#datepickerValue").val() / 1000)
    );
    dateToReserve = {
      year: dateToReserve.year(),
      month: dateToReserve.month(),
      date: dateToReserve.date()
    };

    $.post("/getReservedTimes", { placeID, dateToReserve }, function(times) {
      console.log(times);
      // for (var i = 0; i < times.length; ++i) {
      //   console.log(times[i]);
      // }
    });

    // console.log(dateToReserve.format("dddd, MMMM DD YYYY, h:mm:ss a"));
    // var dateToReserve = {
    //   year:
    // }
    return false;
  });

  // setRequestID = false;
  // $("form").submit(function() {
  //   console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  //   academic = $("input[name=academic]:checked").val();
  //   // alert("dksfhskdjf");
  //   if (academic) {
  //     if (!setRequestID) {
  //       $.get("/submit-request", function(data) {
  //         $("form").attr("action", "rsv?step=2&requestID=" + data.requestID);
  //         setRequestID = true;
  //         $("form").submit();
  //       });
  //     }
  //     return setRequestID;
  //   } else {
  //     $("#err_msg").text("نوع درخواست انتخاب نشده است");
  //     return false;
  //   }
  // });
});
