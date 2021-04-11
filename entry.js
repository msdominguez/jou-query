let currentEntry = {};

onLoadEntry = () => {
    currentEntry = JSON.parse(localStorage.getItem("currentEntry"));
    $(".date").html(currentEntry.date);
    $(".time").html(currentEntry.time);
    $(".title").html(currentEntry.title);
    $(".song").html(currentEntry.song);

    const entryFormatted = currentEntry.entry.split(/\r?\n/);

    $(".entry").html("");
    console.log(entryFormatted);
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
};

onClickBackEntry = () => {
    localStorage.clear();
};

onClickEditEntry = () => {
    window.location.href = "/upsert-entry.html";
};

onClickDeleteEntry = () => {
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
        error: function(e) {
            $("#saveToast").html("error saving");
            $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
        },
        success: function(data) {
            $("#saveToast").html("saved");
        },
    });
    localStorage.clear();
    window.location.href = "/";
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
            error: function(e) {
                $("#saveToast").html("error saving");
                $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
            },
            success: function(data) {
                $("#saveToast").html("saved");
                localStorage.setItem("currentEntry", JSON.stringify(updatedEntry));
            },
        });
    } catch (error) {
        console.error(error);
    }
});