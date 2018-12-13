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

        var projectorSelect = $("select[name=projector]");
        var computerSelect = $("select[name=computer]");
        var boardSelect = $("select[name=board]");
        var wifiSelect = $("select[name=wifi]");

        var arrarr = [projectorSelect, computerSelect, boardSelect, wifiSelect];

        var counterDeleted = 0;
        for (var i = 0; i < event.data.length; ++i) {
          for (var j = 0; j < arrarr.length; ++j) {
            var varivari = arrarr[j];

            if ($(varivari).val() == "all") {
              continue;
            }
            if (
              event.data[i].equipment[$(varivari).attr("name")].toString() !=
              $(varivari).val()
            ) {
              newData.splice(i - counterDeleted, 1);
              counterDeleted++;
              break;
            }
          }
        }
        fillTable(newData);
      });

      // $("#projectorSelect").on("change", data, function(event) {
      //   var selectVal = this.value;
      //   if (selectVal == "all") {
      //     fillTable(event.data);
      //   } else {
      //     selectVal = selectVal == "true" ? true : false;
      //     var newData = [];
      //     for (var i = 0; i < event.data.length; ++i) {
      //       if (event.data[i].equipment.projector == selectVal) {
      //         newData.push(event.data[i]);
      //       }
      //     }
      //     fillTable(newData);
      //   }
      // });
      // $("#computerSelect").on("change", data, function(event) {
      //   var selectVal = this.value;
      //   if (selectVal == "all") {
      //     fillTable(event.data);
      //   } else {
      //     selectVal = selectVal == "true" ? true : false;
      //     var newData = [];
      //     for (var i = 0; i < event.data.length; ++i) {
      //       if (event.data[i].equipment.computer == selectVal) {
      //         newData.push(event.data[i]);
      //       }
      //     }
      //     fillTable(newData);
      //   }
      // });
      // $("#boardSelect").on("change", data, function(event) {
      //   var selectVal = this.value;
      //   if (selectVal == "all") {
      //     fillTable(event.data);
      //   } else {
      //     selectVal = selectVal == "true" ? true : false;
      //     var newData = [];
      //     for (var i = 0; i < event.data.length; ++i) {
      //       if (event.data[i].equipment.board == selectVal) {
      //         newData.push(event.data[i]);
      //       }
      //     }
      //     fillTable(newData);
      //   }
      // });
      // $("#wifiSelect").on("change", data, function(event) {
      //   var selectVal = this.value;
      //   if (selectVal == "all") {
      //     fillTable(event.data);
      //   } else {
      //     selectVal = selectVal == "true" ? true : false;
      //     var newData = [];
      //     for (var i = 0; i < event.data.length; ++i) {
      //       if (event.data[i].equipment.wifi == selectVal) {
      //         newData.push(event.data[i]);
      //       }
      //     }
      //     fillTable(newData);
      //   }
      // });
    }
  });

  // $("#projector").change(function() {
  //   console.log(this.value);
  // });
});
