function fillTable(data) {
  var table = $("table#places").empty();
  if (!data) {
    return;
  }

  table.append(
    "<tr><th>شماره درخواست</th><th>تاریخ درخواست</th><th>محل رزرو شده</th><th>تاریخ رزرو شده</th><th>زمان رزرو شده</th></tr>"
  );

  var requestDate = new persianDate(new Date(data.requestDate));
  var cell =
    "<td>" +
    data.followCode +
    "</td>" +
    "<td>" +
    (requestDate.hour() + ":" + requestDate.minute()) +
    " - " +
    (requestDate.year() +
      "/" +
      requestDate.month() +
      "/" +
      requestDate.date()) +
    "</td>" +
    "<td>" +
    data.place +
    "</td>" +
    "<td>" +
    (data.date.year + "/" + data.date.month + "/" + data.date.date) +
    "</td>" +
    "<td>" +
    (data.time.hourFrom +
      ":" +
      data.time.minFrom +
      " تا " +
      data.time.hourTo +
      ":" +
      data.time.minTo) +
    "</td>";

  table.append("<tr>" + cell + "</tr>");
}

$(function() {
  $("#checkCode").click(function() {
    var code = $("#followCode").val();

    if (code != "") {
      $.get("/getRequest?code=" + code, function(data) {
        if (data.message) {
          fillTable(null);
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("درخواستی وجود ندارد!");
        } else {
          fillTable(data);
          $("span#message").text("");
        }
      });
    }
  });
});
