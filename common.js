const clearLocalStorage = () => {
  localStorage.clear();
};

const clearToast = () => {
  $("#saveToast").html("");
};

const toggleHeartFill = (id) => {
  const heartFill = $(`#${id}`).attr("fill");
  $(`#${id}`).attr("fill", heartFill === "none" ? "var(--jou-color)" : "none");
};

const updateFavorite = (currentEntry) => {
  const updatedEntry = { ...currentEntry, favorite: !currentEntry.favorite };
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
    console.log(`[updateFavorite] error: ${error}`);
  }
};
