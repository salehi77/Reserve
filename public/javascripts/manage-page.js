function fillTable(data) {
  var table = $("table#places").empty();
  table.append(
    "<tr><th>شناسه</th><th>تاریخ ثبت رزرو</th><th>دانشگاهی</th><th>نام/شماره کاربر</th><th>شماره ثابت</th><th>شماره همراه</th><th>موضوع برنامه</th><th>سطح برنامه</th><th>محل رزرو</th><th>تاریخ رزرو</th><th>زمان رزرو</th></tr>"
  );

  for (var i = 0; i < data.length; ++i) {
    var requestDate = new persianDate(new Date(data[i].requestDate));
    var level = data[i].planDetail.level;
    level =
      level == "int"
        ? "بین المللی"
        : level == "nat"
        ? "ملی"
        : level == "reg"
        ? "منطقه ای"
        : level == "prov"
        ? "استانی"
        : "سایر";

    var cell =
      "<td>" +
      data[i].ID +
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
      (data[i].academic == "academic" ? "بله" : "خیر") +
      "</td>" +
      "<td>" +
      data[i].personDetail.username +
      "</td>" +
      "<td>" +
      data[i].personDetail.telNumber +
      "</td>" +
      "<td>" +
      data[i].personDetail.mobNumber +
      "</td>" +
      "<td>" +
      data[i].planDetail.subject +
      "</td>" +
      "<td>" +
      level +
      "</td>" +
      "<td>" +
      data[i].place +
      "</td>" +
      "<td>" +
      (data[i].date.year + "/" + data[i].date.month + "/" + data[i].date.date) +
      "</td>" +
      "<td>" +
      (data[i].time.hourFrom +
        ":" +
        data[i].time.minFrom +
        " تا " +
        data[i].time.hourTo +
        ":" +
        data[i].time.minTo) +
      "</td>";
    table.append("<tr>" + cell + "</tr>");
  }
}

$(function() {
  $("button#addplace").click(function() {
    $("div#addingPlace").css("display", "block");
    $("div#addingUser").css("display", "none");
    $("div#reserveList").css("display", "none");
    $("span#message").text("");
  });
  $("button#adduser").click(function() {
    $("div#addingPlace").css("display", "none");
    $("div#addingUser").css("display", "block");
    $("div#reserveList").css("display", "none");
    $("span#message").text("");
  });
  $("button#showReserves").click(function() {
    $("div#addingUser").css("display", "none");
    $("div#addingPlace").css("display", "none");
    $("div#reserveList").css("display", "block");

    var urlParams = new URLSearchParams(window.location.search);

    $.ajax({
      type: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("x-auth", urlParams.get("auth"));
      },
      url: "/manage//reserveList",
      success: function(msg) {
        if (!msg.error) {
          fillTable(msg.docs);
        } else {
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("دوباره تلاش کنید!");
        }
      }
    });

    $("span#message").text("");
  });

  // Send ajax request for create place
  $("#addingPlace #createPlace").click(function() {
    if ($("#addingPlace #name").val() == "") {
      $("#addingPlace #name").css("border", "1px solid red");
      return;
    }
    $("#addingPlace #name").css("border", "");
    if ($("#addingPlace #capacity").val() == "") {
      $("#addingPlace #capacity").css("border", "1px solid red");
      return;
    }
    $("#addingPlace #capacity").css("border", "");

    var urlParams = new URLSearchParams(window.location.search);

    $.ajax({
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("x-auth", urlParams.get("auth"));
      },
      url: "/manage/addPlace",
      data: {
        name: $("#addingPlace #name").val(),
        type: $("#addingPlace #selectType").val(),
        projector: $("#addingPlace #projectorID:checked").val(),
        computer: $("#addingPlace #computerID:checked").val(),
        board: $("#addingPlace #boardID:checked").val(),
        wifi: $("#addingPlace #wifiID:checked").val(),
        capacity: $("#addingPlace #capacity").val()
      },
      success: function(msg) {
        if (!msg.error) {
          $("div#addingPlace").css("display", "none");
          $("span#message")
            .css("color", "green")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("فضا ایجاد شد!");
        } else {
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("دوباره تلاش کنید!");
        }
      }
    });
  });

  // Send ajax request for create user
  $("#addingUser #createUser").click(function() {
    if ($("#addingUser #username").val() == "") {
      $("#addingUser #username").css("border", "1px solid red");
      return;
    }
    $("#addingUser #username").css("border", "");
    if ($("#addingUser #password").val() == "") {
      $("#addingUser #password").css("border", "1px solid red");
      return;
    }
    $("#addingUser #password").css("border", "");
    if (
      $("#addingUser #confPassword").val() == "" ||
      $("#addingUser #password").val() !== $("#addingUser #confPassword").val()
    ) {
      $("#addingUser #confPassword").css("border", "1px solid red");
      return;
    }
    $("#addingUser #confPassword").css("border", "");

    var urlParams = new URLSearchParams(window.location.search);

    $.ajax({
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("x-auth", urlParams.get("auth"));
      },
      url: "/manage/addUser",
      data: {
        username: $("#addingUser #username").val(),
        password: $("#addingUser #password").val(),
        academic: $("#addingUser #academic:checked").val()
      },
      success: function(msg) {
        if (!msg.error && !msg.dup && msg.success) {
          $("div#addingUser").css("display", "none");
          $("span#message")
            .css("color", "green")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("کاربر ایجاد شد!");
        } else if (!msg.error && msg.dup) {
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("کاربر تکراری!");
        } else {
          $("span#message")
            .css("color", "red")
            .css("font-size", 24)
            .css("font-weight", "bold")
            .text("دوباره تلاش کنید!");
        }
      }
    });
  });
});
