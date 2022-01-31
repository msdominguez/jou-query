const populateInputs = () => {
  const currentEntry = JSON.parse(localStorage.getItem("currentEntry"));

  if (!currentEntry) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayStr = `${yyyy}-${mm}-${dd}`;
    $("#dateInput").val(todayStr);

    const time = moment().format("LTS");
    const amPm = time.split(" ")[1];
    $("#amPmInput").val(amPm);
    const timeFormatted = moment(new Date()).format("hh:mm:ss");
    $("#timeInput").val(timeFormatted);
    $("#timeInput").inputmask("hh:mm:ss", {
      placeholder: timeFormatted,
      insertMode: false,
      showMaskOnHover: false,
      hourFormat: 12,
    });
  } else {
    const isoDate = new Date(currentEntry.date).toISOString().split("T")[0];
    $("#dateInput").val(isoDate);
    const [time, amPM] = currentEntry.time.split(" ");
    console.log(time);
    $("#timeInput").val(time);
    $("#amPmInput").val(amPM);
    $("#titleInput").val(currentEntry.title);
    $("#songInput").val(currentEntry.song);
    $("#entryInput").val(currentEntry.entry);
    $("#heart").attr(
      "fill",
      currentEntry.favorite ? "var(--jou-color)" : "none"
    );
  }
};

const saveEntry = () => {
  const amPm = $("#amPmInput").val();
  const currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
  const url = !currentEntry ? "addEntry" : "updateEntry";
  $.ajax({
    type: "POST",
    url: `/${url}`,
    contentType: "application/json",
    data: JSON.stringify({
      time: `${$("#timeInput").val()} ${amPm}`,
      date: $("#dateInput").val(),
      title: $("#titleInput").val(),
      song: $("#songInput").val(),
      entry: $("#entryInput").val(),
      favorite: $("#heart").attr("fill") === "var(--jou-color)",
      currentEntry,
    }),
    error: function (e) {
      $("#saveToast").html(`error - ${url}`);
      $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
    },
    success: function (data) {
      $("#saveToast").html("saved");
      setTimeout(clearToast, 2000);
    },
  });
};
