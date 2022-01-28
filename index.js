const numEntriesPerPage = 10;
var totalNumEntries = 0;
var currentIndex = 0;
var currentPage = 0;
var numPages = 0;
const years = ["2022", "2021", "2020"];
var year = new Date().getFullYear();

const getEntriesLength = async () => {
  const searchTerm = $("#searchInput").val().toLowerCase();
  const isFavorites = $("#favoritesBtn").attr("fill") === "var(--jou-color)";
  try {
    return await $.ajax({
      url: `/getEntriesLength?year=${year}&searchTerm=${searchTerm}&isFavorites=${isFavorites}`,
      type: "GET",
    });
  } catch (error) {
    console.log(`[getEntriesLength] error: ${error}`);
  }
};

const getEntries = async () => {
  const searchTerm = $("#searchInput").val().toLowerCase();
  const isFavorites = $("#favoritesBtn").attr("fill") === "var(--jou-color)";
  try {
    return await $.ajax({
      url: `/getEntries?startingIndex=${currentIndex}&numEntries=${numEntriesPerPage}&year=${year}&searchTerm=${searchTerm}&isFavorites=${isFavorites}`,
      type: "GET",
    });
  } catch (error) {
    console.log(`[getEntries] error: ${error}`);
  }
};

const getEntriesAndLengths = async () => {
  return Promise.all([getEntries(), getEntriesLength()]);
};

const sortEntries = (entries) => {
  const sortedEntries = entries.sort((a, b) => {
    let aDate = new Date(`${a.date} ${a.time}`);
    let bDate = new Date(`${b.date} ${b.time}`);
    return aDate - bDate;
  });
  return sortedEntries;
};

const loadPagePaginated = async () => {
  $("#entriesContainer").html("");

  const [entries, entriesLength] = await getEntriesAndLengths();

  totalNumEntries = entriesLength;
  numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;

  if (currentPage === 0) {
    $("#leftBtn").addClass("hidden");
  } else {
    $("#leftBtn").removeClass("hidden");
  }

  if (currentPage < numPages) {
    $("#rightBtn").removeClass("hidden");
  }

  if (currentPage === numPages) {
    $("#rightBtn").addClass("hidden");
  }

  populateEntries(entries);
};

const loadNextPage = () => {
  currentPage += 1;
  currentIndex += numEntriesPerPage;
  loadPagePaginated();
};

const loadPrevPage = () => {
  currentPage -= 1;
  currentIndex -= numEntriesPerPage;
  loadPagePaginated();
};

const populateEntries = (entries) => {
  $("#entriesContainer").html("");

  if (entries.length !== 0) {
    // const sortedEntries = entries;
    const sortedEntries = sortEntries(entries);

    sortedEntries.map((entry, i) => {
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
      $("#entriesContainer").prepend(`<div class="entry-container">
        <div class="date-time-heart">
        <div class="date-time">
        <label class="date">${formattedDate}</label>
        <label class="separator">•</label>
        <label class="time listing">${entry.time}</label>
        </div>
        <svg id="heart${i}" class="heart" width="23" height="21"
         viewBox="0 0 23 21" fill=${
           entry.favorite ? "var(--jou-color)" : "none"
         } xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2913 2.61183C19.7805 2.10083 19.1741 1.69547 18.5066 1.41891C17.8392 1.14235 17.1238 1 16.4013 1C15.6788 1 14.9634 1.14235 14.2959 1.41891C13.6285 1.69547 13.022 2.10083 12.5113 2.61183L11.4513 3.67183L10.3913 2.61183C9.3596 1.58013 7.96032 1.00053 6.50129 1.00053C5.04226 1.00053 3.64298 1.58013 2.61129 2.61183C1.5796 3.64352 1 5.04279 1 6.50183C1 7.96086 1.5796 9.36013 2.61129 10.3918L3.67129 11.4518L11.4513 19.2318L19.2313 11.4518L20.2913 10.3918C20.8023 9.88107 21.2076 9.27464 21.4842 8.60718C21.7608 7.93972 21.9031 7.22431 21.9031 6.50183C21.9031 5.77934 21.7608 5.06393 21.4842 4.39647C21.2076 3.72901 20.8023 3.12258 20.2913 2.61183V2.61183Z" stroke="var(--jou-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        <h2 class="title ${entry.title ? "listing" : "hide-entry"}
        ">${entry.title}</h2>
        <p class="song ${entry.song ? "listing" : "hide-entry"}">${
        entry.song
      }</p>
        <p class="entry ${entry.entry ? "listing" : "hide-entry"}">${
        entry.entry
      }</p>
        </div>
        `);
    });
  }
};

const repopulateWithPagination = async () => {
  const [entries, entriesLength] = await getEntriesAndLengths();

  currentPage = 0;
  totalNumEntries = 0;
  currentIndex = 0;
  numPages = 0;

  $("#entriesContainer").html("");
  $("#leftBtn").addClass("hidden");

  if (entriesLength !== 0) {
    totalNumEntries = entriesLength;
    if (totalNumEntries <= numEntriesPerPage) {
      $("#rightBtn").addClass("hidden");
    } else {
      $("#rightBtn").removeClass("hidden");
    }
    numPages = Math.ceil(totalNumEntries / numEntriesPerPage) - 1;
  }
  populateEntries(entries);
};

const toggleActiveYear = (selectedYear) => {
  $(".year").removeClass("year-active");
  $(".year").addClass("year-inactive");

  if (selectedYear.text() === year) {
    $(selectedYear).addClass("year-inactive");
    $(selectedYear).removeClass("year-active");
    year = new Date().getFullYear();
  } else {
    $(selectedYear).addClass("year-active");
    $(selectedYear).removeClass("year-inactive");
    year = selectedYear.text();
  }

  repopulateWithPagination();
};

const populateYears = () => {
  $("#yearsList").append(
    years.map(
      (yr) =>
        `<li onclick="toggleActiveYear($(this))" class="${
          year === yr ? "year year-active" : "year year-inactive"
        }">${yr}</li>`
    )
  );
};

const loadPage = () => {
  populateYears();
  repopulateWithPagination();
};

const toggleFavoritesFilter = () => {
  toggleHeartFill("favoritesBtn");
  repopulateWithPagination();
};

const updateSelectedFavorite = (e) => {
  e.stopPropagation();

  const [dateTimeHeart, title, song, entry] =
    e.currentTarget.previousElementSibling.parentNode.parentNode.children;
  const [dateTime, heart] = dateTimeHeart.children;
  const [date, , time] = dateTime.children;
  const favorite = $(`#${heart.id}`).attr("fill") === "var(--jou-color)";
  toggleHeartFill(heart.id);

  const currentEntry = {
    time: time.innerHTML,
    date: date.innerHTML,
    title: title.innerHTML,
    song: song.innerHTML,
    entry: entry.innerHTML,
    favorite,
  };
  updateFavorite(currentEntry);
};

const loadSelectedEntry = (e) => {
  const [dateTimeHeart, title, song, entry] = e.currentTarget.children;
  const [dateTime, heart] = dateTimeHeart.children;
  const [date, , time] = dateTime.children;
  const favorite = $(`#${heart.id}`).attr("fill") === "var(--jou-color)";

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
};

$(document).on("click", ".heart", (e) => updateSelectedFavorite(e));
$(document).on("click", ".entry-container", (e) => loadSelectedEntry(e));
