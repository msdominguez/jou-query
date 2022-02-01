let currentEntry = {};

const getAdjacentEntry = async (direction) => {
  try {
    currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
    return await $.ajax({
      url: `/get${direction}Entry?date=${currentEntry.date}&time=${currentEntry.time}`,
      type: "GET",
    });
  } catch (error) {
    console.log(`[get${direction}Entry] error: ${error}`);
  }
};

const getNextEntry = async () => {
  return await getAdjacentEntry("Next");
};

const getPrevEntry = async () => {
  return await getAdjacentEntry("Prev");
};

const resetPagination = () => {
  getNextEntry().then((entry) => {
    if (Object.keys(entry).length === 0) {
      $("#rightBtn").addClass("hidden");
    } else {
      $("#rightBtn").removeClass("hidden");
    }
  });
  getPrevEntry().then((entry) => {
    if (Object.keys(entry).length === 0) {
      $("#leftBtn").addClass("hidden");
    } else {
      $("#leftBtn").removeClass("hidden");
    }
  });
};

const loadEntry = () => {
  $("#date").html(currentEntry.date);
  $("#time").html(currentEntry.time);
  $("#title").html(currentEntry.title);
  $("#song").html(currentEntry.song);

  $(".day-of-week").removeClass("current-day-of-week");

  const currentDayOfWeek = currentEntry.date.toLowerCase().split(",")[0];
  $(`#${currentDayOfWeek}`).addClass("current-day-of-week");

  const entryFormatted = currentEntry.entry.split(/\r?\n/);
  $("#entry").html("");
  entryFormatted.forEach((line) => {
    if (line === "") {
      $("#entry").append('<p class="entry-line-spacer"></p>');
    }
    $("#entry").append(`<p class="entry-line">${line}</p>`);
  });

  $("#heart").attr("fill", currentEntry.favorite ? "var(--jou-color)" : "none");

  resetPagination();
};

const setInitialEntry = () => {
  currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
  loadEntry();
};

const setCurrentEntry = (entry) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  const formattedDate = new Date(entry.date).toLocaleDateString(
    "en-US",
    options
  );

  const newCurrentEntry = {
    time: entry.time,
    date: formattedDate,
    title: entry.title,
    song: entry.song,
    entry: entry.entry,
    favorite: entry.favorite,
  };

  localStorage.setItem("currentEntry", JSON.stringify(newCurrentEntry));
  window.location.href = "/entry.html";
  loadEntry();
};

const loadNextEntry = () => {
  getNextEntry().then((entry) => {
    setCurrentEntry(entry);
  });
};

const loadPrevEntry = () => {
  getPrevEntry().then((entry) => {
    setCurrentEntry(entry);
  });
};

const goToUpsertEntry = () => {
  window.location.href = "/upsert-entry.html";
};

const deleteEntry = () => {
  const confirmDelete = confirm("are you sure you want to delete this entry?");
  if (confirmDelete) {
    $.ajax({
      type: "POST",
      url: "/deleteEntry",
      contentType: "application/json",
      data: JSON.stringify({
        time: currentEntry.time,
        date: currentEntry.date,
        title: currentEntry.title,
        song: currentEntry.song,
        entry: currentEntry.entry,
        favorite: currentEntry.favorite,
      }),
      error: function (e) {
        $("#saveToast").html("error - deleteEntry");
        $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
      },
      success: function (data) {
        $("#saveToast").html("saved");
        setTimeout(clearToast, 2000);
      },
    });
    clearLocalStorage();
    window.location.href = "/";
  }
};

updateCurrentFavorite = () => {
  toggleHeartFill("heart");
  updateFavorite(currentEntry);
};
