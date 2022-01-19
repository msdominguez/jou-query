const numEntriesPerPage = 10;
let totalNumEntries = 0;
let currentIndex = 0;
let currentPage = 0;
let numPages = 0;
const years = ["2022", "2021", "2020"];
var year;

onSelectYear = (selectedYear) => {
  $(".year").removeClass("year-active");
  $(".year").addClass("year-inactive");

  if (selectedYear.text() === year) {
    $(selectedYear).addClass("year-inactive");
    $(selectedYear).removeClass("year-active");
    year = undefined;
  } else {
    $(selectedYear).addClass("year-active");
    $(selectedYear).removeClass("year-inactive");
    year = selectedYear.text();
  }

  resetPaginationEntries();
};

populateYears = () => {
  $(".years-list").append(
    years.map(
      (yr) =>
        `<li onClick="onSelectYear($(this))" class="${
          year === yr ? "year year-active" : "year year-inactive"
        }">${yr}</li>`
    )
  );
};

onClickPageNext = () => {
  currentPage += 1;
  currentIndex += numEntriesPerPage;

  $(".entries-container").html("");

  if ($(".favorites-btn").attr("fill") === "var(--jou-color)") {
    getFavorites().then((entries) => {
      getFavoritesLength().then((res) => {
        totalNumEntries = res;
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;

        if (currentPage === 0) {
          $("#left-btn").addClass("hidden");
        } else {
          $("#left-btn").removeClass("hidden");
        }

        if (currentPage < numPages) {
          $("#right-btn").removeClass("hidden");
        }

        if (currentPage === numPages) {
          $("#right-btn").addClass("hidden");
        }
      });

      populateEntries(entries);
    });
  } else {
    getEntries().then((entries) => {
      getEntriesLength().then((res) => {
        totalNumEntries = res;
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;

        if (currentPage === 0) {
          $("#left-btn").addClass("hidden");
        } else {
          $("#left-btn").removeClass("hidden");
        }

        if (currentPage < numPages) {
          $("#right-btn").removeClass("hidden");
        }

        if (currentPage === numPages) {
          $("#right-btn").addClass("hidden");
        }
      });
      populateEntries(entries);
    });
  }
};

onClickPagePrev = () => {
  currentPage -= 1;
  currentIndex -= numEntriesPerPage;

  $(".entries-container").html("");

  if ($(".favorites-btn").attr("fill") === "var(--jou-color)") {
    getFavorites().then((entries) => {
      getFavoritesLength().then((res) => {
        totalNumEntries = res;
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;

        if (currentPage === 0) {
          $("#left-btn").addClass("hidden");
        } else {
          $("#left-btn").removeClass("hidden");
        }

        if (currentPage < numPages) {
          $("#right-btn").removeClass("hidden");
        }

        if (currentPage === numPages) {
          $("#right-btn").addClass("hidden");
        }
      });
      populateEntries(entries);
    });
  } else {
    getEntries().then((entries) => {
      getEntriesLength().then((res) => {
        totalNumEntries = res;
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;

        if (currentPage === 0) {
          $("#left-btn").addClass("hidden");
        } else {
          $("#left-btn").removeClass("hidden");
        }

        if (currentPage < numPages) {
          $("#right-btn").removeClass("hidden");
        }

        if (currentPage === numPages) {
          $("#right-btn").addClass("hidden");
        }
      });
      populateEntries(entries);
    });
  }
};

getFavoritesLength = async () => {
  try {
    return await $.ajax({
      url: `/getFavoritesLength${year ? `?year=${year}` : ""}`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

getEntriesLength = async () => {
  try {
    return await $.ajax({
      url: `/getEntriesLength?startingIndex=${currentIndex}&numEntries=${numEntriesPerPage}${
        year ? `&year=${year}` : ""
      }`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

getEntries = async () => {
  try {
    return await $.ajax({
      url: `/getEntries?startingIndex=${currentIndex}&numEntries=${numEntriesPerPage}${
        year ? `&year=${year}` : ""
      }`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

getFavorites = async () => {
  try {
    return await $.ajax({
      url: `/getFavorites?startingIndex=${currentIndex}&numEntries=${numEntriesPerPage}${
        year ? `&year=${year}` : ""
      }`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

getSearchedEntries = async () => {
  try {
    const searchTerm = $(".search-input").val().toLowerCase();
    return await $.ajax({
      url: `/getSearchedEntries?startingIndex=${currentIndex}&numEntries=${numEntriesPerPage}&searchTerm=${searchTerm}${
        year ? `&year=${year}` : ""
      }`,
      type: "GET",
    });
  } catch (error) {
    console.error(error);
  }
};

sortEntries = (entries) => {
  const sortedEntries = entries.sort((a, b) => {
    let aDate = new Date(`${a.date} ${a.time}`);
    let bDate = new Date(`${b.date} ${b.time}`);
    return aDate - bDate;
  });
  return sortedEntries;
};

populateEntries = (entries) => {
  $(".entries-container").html("");

  if (entries.length !== 0) {
    let counter = 0;

    sortedEntries = sortEntries(entries);

    sortedEntries.map((entry) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      };
      let formattedDate = new Date(entry.date).toLocaleDateString(
        "en-US",
        options
      );
      $(".entries-container").prepend(`<div class="entry-container">
        <div class="date-time">
        <label class="date">${formattedDate}</label>
        <label class="separator">•</label>
        <label class="time listing">${entry.time}</label>
        </div>
        <svg id="heart${counter}" class="heart" width="23" height="21" viewBox="0 0 23 21" fill="${
        entry.favorite ? "var(--jou-color)" : "none"
      }" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2913 2.61183C19.7805 2.10083 19.1741 1.69547 18.5066 1.41891C17.8392 1.14235 17.1238 1 16.4013 1C15.6788 1 14.9634 1.14235 14.2959 1.41891C13.6285 1.69547 13.022 2.10083 12.5113 2.61183L11.4513 3.67183L10.3913 2.61183C9.3596 1.58013 7.96032 1.00053 6.50129 1.00053C5.04226 1.00053 3.64298 1.58013 2.61129 2.61183C1.5796 3.64352 1 5.04279 1 6.50183C1 7.96086 1.5796 9.36013 2.61129 10.3918L3.67129 11.4518L11.4513 19.2318L19.2313 11.4518L20.2913 10.3918C20.8023 9.88107 21.2076 9.27464 21.4842 8.60718C21.7608 7.93972 21.9031 7.22431 21.9031 6.50183C21.9031 5.77934 21.7608 5.06393 21.4842 4.39647C21.2076 3.72901 20.8023 3.12258 20.2913 2.61183V2.61183Z" stroke="var(--jou-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1 class=${entry.title ? "title listing" : "hide-entry"}>${
        entry.title
      }</h1>
        <p class=${entry.song ? "song listing" : "hide-entry"}>${entry.song}</p>
        <p class=${entry.entry ? "entry listing" : "hide-entry"}>${
        entry.entry
      }</p>
        </div>
        `);
      counter++;
    });
  }
};

resetPaginationFavs = () => {
  getFavorites().then((entries) => {
    currentPage = 0;
    totalNumEntries = 0;
    currentIndex = 0;
    numPages = 0;
    $(".entries-container").html("");
    $("#left-btn").addClass("hidden");

    getFavoritesLength().then((res) => {
      totalNumEntries = res;
      if (res !== 0) {
        if (totalNumEntries <= numEntriesPerPage) {
          $("#right-btn").addClass("hidden");
        } else {
          $("#right-btn").removeClass("hidden");
        }
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;
      }
    });
    populateEntries(entries);
  });
};

resetPaginationEntries = () => {
  getEntries().then((entries) => {
    currentPage = 0;
    totalNumEntries = 0;
    currentIndex = 0;
    numPages = 0;
    $(".entries-container").html("");
    $("#left-btn").addClass("hidden");

    getEntriesLength().then((res) => {
      if (res !== 0) {
        totalNumEntries = res;
        if (totalNumEntries <= numEntriesPerPage) {
          $("#right-btn").addClass("hidden");
        } else {
          $("#right-btn").removeClass("hidden");
        }
        numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;
      }
    });
    populateEntries(entries);
  });
};

onLoad = () => {
  resetPaginationEntries();
  populateYears();
};

onClickFavoritesIcon = () => {
  $(".entries-container").html("");

  const favoritesBtn = $(".favorites-btn");
  if (favoritesBtn.attr("fill") === "none") {
    favoritesBtn.attr("fill", "var(--jou-color)");
    resetPaginationFavs();
  } else {
    favoritesBtn.attr("fill", "none");
    resetPaginationEntries();
  }
};

$(document).on("click", ".entry-container", (event) => {
  const [dateTime, heart, title, song, entry] = event.currentTarget.children;
  const [date, , time] = dateTime.children;

  let favorite = true;
  const currentHeart = $(`#${heart.id}`);
  if (currentHeart.attr("fill") === "none") {
    favorite = false;
  }

  const currentEntry = {
    time: time.innerHTML,
    date: date.innerHTML,
    title: title.innerHTML,
    song: song.innerHTML,
    entry: entry.innerHTML,
    favorite,
  };
  localStorage.setItem("currentEntry", JSON.stringify(currentEntry));
  window.location.href = "/entry.html";
});

$(document).on("click", ".heart", (event) => {
  event.stopPropagation();

  let favorite = false;
  const currentHeart = $(`#${event.currentTarget.id}`);
  if (currentHeart.attr("fill") === "none") {
    currentHeart.attr("fill", "var(--jou-color)");
    favorite = true;
  } else {
    currentHeart.attr("fill", "none");
  }

  const currentEntry = {
    time: event.currentTarget.previousElementSibling.children[2].innerHTML,
    date: event.currentTarget.previousElementSibling.children[0].innerHTML,
    title: event.currentTarget.nextElementSibling.innerHTML,
    song: event.currentTarget.nextElementSibling.nextElementSibling.innerHTML,
    entry:
      event.currentTarget.nextElementSibling.nextElementSibling
        .nextElementSibling.innerHTML,
    favorite: !favorite,
  };
  const updatedEntry = { ...currentEntry, favorite };

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

onSearchEntries = () => {
  getSearchedEntries().then((filteredData) => populateEntries(filteredData));
};
