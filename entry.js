let currentEntry = {};

onLoadEntry = () => {
  currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
  $(".date").html(currentEntry.date);
  $(".time").html(currentEntry.time);
  $(".title").html(currentEntry.title);
  $(".song").html(currentEntry.song);

  const entryFormatted = currentEntry.entry.split(/\r?\n/);

  const currentDayOfWeek = currentEntry.date.split(",")[0];
  $(`#${currentDayOfWeek}`).addClass("current-day-of-week");

  $(".entry").html("");
  entryFormatted.map((entry) => {
    if (entry === "") {
      $(".entry").append('<p class="entry-line-spacer"></p>');
    }
    $(".entry").append(`<p class="entry-line">${entry}</p>`);
  });

  const currentHeart = $("#heart-entry");
  if (currentEntry.favorite) {
    currentHeart.attr("fill", "var(--jou-color)");
  } else {
    currentHeart.attr("fill", "none");
  }

  getNextEntry().then((entry) => {
    if (entry === undefined) {
      $("#right-btn").addClass("hidden");
    } else {
      $("#right-btn").removeClass("hidden");
    }
  });
  getPrevEntry().then((entry) => {
    if (entry === undefined) {
      $("#left-btn").addClass("hidden");
    } else {
      $("#left-btn").removeClass("hidden");
    }
  });
};

onClickHome = () => {
  localStorage.clear();
};

onClickEditEntry = () => {
  window.location.href = "/upsert-entry.html";
};

onClickDeleteEntry = () => {
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
        $("#saveToast").html("error saving");
        $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
      },
      success: function (data) {
        $("#saveToast").html("saved");
      },
    });
    localStorage.clear();
    window.location.href = "/";
  }
};

$(document).on("click", ".heart", (event) => {
  event.stopPropagation();

  const currentHeart = $(`#${event.currentTarget.id}`);
  let favorite = false;
  if (currentHeart.attr("fill") === "none") {
    currentHeart.attr("fill", "var(--jou-color)");
    favorite = true;
  } else {
    currentHeart.attr("fill", "none");
  }

  const updatedEntry = {
    time: currentEntry.time,
    date: currentEntry.date,
    title: currentEntry.title,
    song: currentEntry.song,
    entry: currentEntry.entry,
    favorite,
  };

  try {
    $.ajax({
      type: "POST",
      url: "/updateFavorite",
      contentType: "application/json",
      data: JSON.stringify(currentEntry),
      error: function (e) {
        $("#saveToast").html("error saving");
        $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
      },
      success: function (data) {
        $("#saveToast").html("saved");
        localStorage.setItem("currentEntry", JSON.stringify(updatedEntry));
      },
    });
  } catch (error) {
    console.error(error);
  }
});

getNextEntry = async () => {
  try {
    currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
    return await $.ajax({
      url: `/getNextEntry?date=${currentEntry.date}&time=${currentEntry.time}`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

getPrevEntry = async () => {
  try {
    currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
    return await $.ajax({
      url: `/getPrevEntry?date=${currentEntry.date}&time=${currentEntry.time}`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

setNextPrevEntry = (entry) => {
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

  $(".date").html(formattedDate);
  $(".time").html(currentEntry.time);
  $(".title").html(currentEntry.title);
  $(".song").html(currentEntry.song);
  $(".entry").html(currentEntry.entry);

  const currentHeart = $("#heart-entry");

  if (entry.favorite) {
    currentHeart.attr("fill", "var(--jou-color)");
  } else {
    currentHeart.attr("fill", "none");
  }

  localStorage.setItem("currentEntry", JSON.stringify(newCurrentEntry));
  window.location.href = "/entry.html";
};

onClickPageNext = () => {
  getNextEntry().then((entry) => {
    setNextPrevEntry(entry);
  });
};

onClickPagePrev = () => {
  getPrevEntry().then((entry) => {
    setNextPrevEntry(entry);
  });
};
