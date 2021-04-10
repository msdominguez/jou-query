getEntries = async() => {
    try {
        return await $.ajax({
            url: `/getEntries?startingIndex=${currentIndex}&numEntries=${numEntries}`,
            type: "GET",
        });
    } catch (error) {
        console.error(error);
    }
};

onLoad = () => {
    const currentEntry = JSON.parse(localStorage.getItem("currentEntry"));

    if (!currentEntry) {
        const todayStr = new Date().toISOString().split("T")[0];
        const time = moment().format("LTS");
        $("#dateInput").val(todayStr);
        $("#timeInput").val(time);
    } else {
        const isoDate = new Date(currentEntry.date).toISOString().split("T")[0];
        $("#dateInput").val(isoDate);
        $("#timeInput").val(currentEntry.time);
        $("#titleInput").val(currentEntry.title);
        $("#songInput").val(currentEntry.song);
        $("#entryInput").val(currentEntry.entry);
        const currentHeart = $(".heart-upsert");
        if (currentEntry.favorite) {
            currentHeart.attr("fill", "var(--jou-color)");
        } else {
            currentHeart.attr("fill", "none");
        }
    }
};

onClickBack = () => {
    localStorage.clear();
};

onClickSave = () => {
    const time = $("#timeInput").val();
    const date = $("#dateInput").val();
    const title = $("#titleInput").val();
    const song = $("#songInput").val();
    const entry = $("#entryInput").val();
    const currentHeart = $(".heart-upsert");
    let favorite;
    if (currentHeart.attr("fill") === "none") {
        favorite = false;
    } else {
        favorite = true;
    }

    const currentEntry = JSON.parse(localStorage.getItem("currentEntry"));

    if (!currentEntry) {
        $.ajax({
            type: "POST",
            url: "/addEntry",
            contentType: "application/json",
            data: JSON.stringify({
                time,
                date,
                title,
                song,
                entry,
                favorite,
            }),
            error: function(e) {
                $("#saveToast").html("error saving");
                $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
            },
            success: function(data) {
                $("#saveToast").html("saved");
            },
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/updateEntry",
            contentType: "application/json",
            data: JSON.stringify({
                time,
                date,
                title,
                song,
                entry,
                favorite,
                currentEntry,
            }),
            error: function(e) {
                $("#saveToast").html("error saving");
                $("#saveToast").append(`<p>log: ${e.status}: ${e.statusText}</p>`);
            },
            success: function(data) {
                $("#saveToast").html("saved");
            },
        });
    }
};

onClickHeart = () => {
    const currentHeart = $(".heart-upsert");
    if (currentHeart.attr("fill") === "none") {
        currentHeart.attr("fill", "var(--jou-color)");
    } else {
        currentHeart.attr("fill", "none");
    }
};