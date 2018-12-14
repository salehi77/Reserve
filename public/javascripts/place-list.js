function fillTable(data) {
  var table = $("table#places").empty();
  table.append(
    "<tr><th>نام</th><th>نوع</th><th>ظرفیت</th><th>پروژکتور</th><th>کامپیوتر</th><th>تخته</th><th>وایفای</th></tr>"
  );

  for (var i = 0; i < data.length; ++i) {
    var cell =
      "<td>" +
      data[i].name +
      "</td>" +
      "<td>" +
      data[i].type +
      "</td>" +
      "<td>" +
      data[i].capacity +
      "</td>" +
      "<td>" +
      (data[i].equipment.projector ? "دارد" : "ندارد") +
      "</td>" +
      "<td>" +
      (data[i].equipment.computer ? "دارد" : "ندارد") +
      "</td>" +
      "<td>" +
      (data[i].equipment.board ? "دارد" : "ندارد") +
      "</td>" +
      "<td>" +
      (data[i].equipment.wifi ? "دارد" : "ندارد") +
      "</td>";

    table.append("<tr>" + cell + "</tr>");
  }
}

$(function() {
  $.get("/getPlaces", function(data) {
    if (!data.error) {
      data = data.places;
      fillTable(data);

      $(".changeAble").on("change", data, function(event) {
        var newData = event.data.slice();

        var features = [
          $("select[name=projector]"),
          $("select[name=computer]"),
          $("select[name=board]"),
          $("select[name=wifi]")
        ];

        var counterDeleted = 0;
        for (var i = 0; i < event.data.length; ++i) {
          for (var j = 0; j < features.length; ++j) {
            var feature = features[j];

            if ($(feature).val() == "all") {
              continue;
            }

            if (
              event.data[i].equipment[$(feature).attr("name")] !=
              parseInt($(feature).val())
            ) {
              newData.splice(i - counterDeleted, 1);
              counterDeleted++;
              break;
            }
          }
        }
        var capacitySelect = $("select[name=capacity]").val();

        if (!(capacitySelect == "all")) {
          var capacity = [];
          switch (capacitySelect) {
            case "1":
              capacity.push(0);
              capacity.push(50);
              break;
            case "2":
              capacity.push(50);
              capacity.push(80);
              break;
            case "3":
              capacity.push(80);
              capacity.push(100);
              break;
            case "4":
              capacity.push(100);
              capacity.push(5000);
              break;
          }

          for (var i = 0; i < newData.length; ++i) {
            if (
              !(
                newData[i].capacity >= capacity[0] &&
                newData[i].capacity < capacity[1]
              )
            ) {
              newData.splice(i, 1);
              --i;
            }
          }
        }
        fillTable(newData);
      });
    }
  });
});
