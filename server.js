const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("."));

const MongoClient = require("mongodb").MongoClient;

const uri =
    "mongodb+srv://jouquery:jqsandbox@cluster0.s6big.mongodb.net/jou?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    if (err) {
        console.log(err);
        process.exit(100);
    }
    app.listen(process.env.PORT || 1337);
});

// app.get("/getEntriesPastWeek", async function(req, resp) {
//     // get all entries within the past wk as a filter
//     let today = new Date();
//     let todayStr = today.toISOString().split('T')[0];
//     let [year, month, date] = todayStr.split('-');

//     let lastWeekDates = [];
//     for (let i = 0; i < 8; i++) {
//         let lastWeekStr = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i).toISOString().split('T')[0];
//         lastWeekDates.push(lastWeekStr);
//     }

//     const collection = await client.db("jou").collection(year).aggregate([{
//         $project: {
//             entries: {
//                 $filter: {
//                     input: "$entries",
//                     as: "entry",
//                     cond: { $in: ["$$entry.date", lastWeekDates] }
//                 }
//             }
//         }
//     }]).toArray();
//     return resp.json(collection);
// });

// app.get("/getEntriesCurrentMonth", async function (req, resp) {
//     const startingIndex = Number(req.query.startingIndex);
//     const numEntries = Number(req.query.numEntries);
//     const today = new Date();
//     const todayStr = today.toISOString().split("T")[0];
//     const [year, ,] = todayStr.split("-");

//     const collection = await client
//       .db("Jou")
//       .collection(year)
//       .aggregate([
//         {
//           $sort: { month: -1 },
//           $project: {
//             entries: { $slice: ["$entries", startingIndex, numEntries] },
//           },
//         },
//       ])
//       .toArray();
//     return resp.json(collection);
//   });

app.get("/getFavorites", async function(req, resp) {
    const startingIndex = Number(req.query.startingIndex);
    const numEntries = Number(req.query.numEntries);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const [year, month] = todayStr.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let latestEntries = [];
    for (let i = 0; i < 12; i++) {
        let previous = monthNames[(Number(month) - 1 + i) % monthNames.length];
        latestEntries.push(
            await client
            .db("jou")
            .collection(year)
            .aggregate([{
                    $match: {
                        monthName: previous,
                    },
                },
                {
                    $project: {
                        entries: {
                            $filter: {
                                input: "$entries",
                                as: "entry",
                                cond: { $eq: ["$$entry.favorite", true] },
                            },
                        },
                    },
                },
            ])
            .toArray()
        );
    }

    latestEntries = latestEntries
        .flat()
        .map((obj) => obj.entries)
        .flat();

    const sortedEntries = sortEntries(latestEntries);

    const endIndex =
        sortedEntries.length < startingIndex + numEntries ?
        sortedEntries.length :
        numEntries;

    latestEntries = sortedEntries.slice(startingIndex, endIndex);

    return resp.json(latestEntries);
});

app.get("/getFavoritesLength", async function(req, resp) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const [year, , month] = todayStr.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let latestEntries = [];
    for (let i = 0; i < 12; i++) {
        let previous = monthNames[(Number(month) - 1 + i) % monthNames.length];
        latestEntries.push(
            await client
            .db("jou")
            .collection(year)
            .aggregate([{
                    $match: {
                        monthName: previous,
                    },
                },
                {
                    $project: {
                        entries: {
                            $filter: {
                                input: "$entries",
                                as: "entry",
                                cond: { $eq: ["$$entry.favorite", true] },
                            },
                        },
                    },
                },
            ])
            .toArray()
        );
    }

    latestEntries = latestEntries
        .flat()
        .map((obj) => obj.entries)
        .flat();

    const sortedEntries = sortEntries(latestEntries);
    const latestEntriesLength = sortedEntries.length;

    return resp.json(latestEntriesLength);
});

app.get("/getEntriesLength", async function(req, resp) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const [year, , month] = todayStr.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let latestEntries = [];
    for (let i = 0; i < 12; i++) {
        let previous = monthNames[(Number(month) - 1 + i) % monthNames.length];
        latestEntries.push(
            await client
            .db("jou")
            .collection(year)
            .aggregate([{
                $match: {
                    monthName: previous,
                },
            }, ])
            .toArray()
        );
    }

    latestEntries = latestEntries
        .flat()
        .map((obj) => obj.entries)
        .flat();

    const sortedEntries = sortEntries(latestEntries);
    const latestEntriesLength = sortedEntries.length;

    return resp.json(latestEntriesLength);
});

sortEntries = (entries) => {
    const sortedEntries = entries.sort((a, b) => {
        let aDate = new Date(`${a.date} ${a.time}`);
        let bDate = new Date(`${b.date} ${b.time}`);
        return bDate - aDate;
    });
    return sortedEntries;
};

app.get("/getEntries", async function(req, resp) {
    const startingIndex = Number(req.query.startingIndex);
    const numEntries = Number(req.query.numEntries);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const [year, month] = todayStr.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let latestEntries = [];
    for (let i = 0; i < 12; i++) {
        let previous = monthNames[(Number(month) - 1 + i) % monthNames.length];
        latestEntries.push(
            await client
            .db("jou")
            .collection(year)
            .aggregate([{
                $match: {
                    monthName: previous,
                },
            }, ])
            .toArray()
        );
    }

    latestEntries = latestEntries
        .flat()
        .map((obj) => obj.entries)
        .flat();

    const sortedEntries = sortEntries(latestEntries);

    const endIndex =
        sortedEntries.length < startingIndex + numEntries ?
        sortedEntries.length :
        numEntries;

    latestEntries = sortedEntries.slice(startingIndex, endIndex);

    return resp.json(latestEntries);
});

app.post("/addEntry", async function(req, resp) {
    const time = req.body.time;
    const date = req.body.date;
    const title = req.body.title;
    const song = req.body.song;
    const entry = req.body.entry;
    const favorite = req.body.favorite;

    const [year, newMonth] = date.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthStr = monthNames[Number(newMonth) - 1];

    try {
        const collectionMonth = await client
            .db("jou")
            .collection(year)
            .find({ month: newMonth })
            .toArray();

        console.log(collectionMonth);
        if (collectionMonth.length === 0) {
            const collectionYear = await client.db("jou").collection(year);
            collectionYear.insertOne({
                month: newMonth,
                monthName: monthStr,
                entries: [{
                    time,
                    date,
                    title,
                    song,
                    entry,
                    favorite,
                }, ],
            });
        } else {
            const collectionMonthUpdate = await client.db("jou").collection(year);
            const query = {
                month: newMonth,
            };
            const options = { upsert: false };
            const update = {
                $push: {
                    entries: {
                        time,
                        date,
                        title,
                        song,
                        entry,
                        favorite,
                    },
                },
            };
            collectionMonthUpdate.updateOne(query, update, options);
        }
        return resp.sendStatus(200);
    } catch (err) {
        return resp.status(500).send(err);
    }
});

app.post("/updateEntry", async function(req, resp) {
    const time = req.body.time;
    const dateParam = req.body.date;
    const title = req.body.title;
    const song = req.body.song;
    const entry = req.body.entry;
    const favorite = req.body.favorite;
    const currentEntry = req.body.currentEntry;

    const date = new Date(dateParam).toISOString().split("T")[0];
    const [year, month] = date.split("-");

    try {
        const collectionMonthUpdate = await client.db("jou").collection(year);
        const query = {
            month,
        };
        const currentElement = {
            time: currentEntry.time,
            date: new Date(currentEntry.date).toISOString().split("T")[0],
            title: currentEntry.title,
            song: currentEntry.song,
            entry: currentEntry.entry,
            favorite: currentEntry.favorite,
        };
        const newElement = {
            time,
            date,
            title,
            song,
            entry,
            favorite,
        };
        collectionMonthUpdate.updateOne(
            query, {
                $set: {
                    "entries.$[element]": newElement,
                },
            }, {
                arrayFilters: [{ element: currentElement }],
                upsert: false,
            }
        );
        return resp.sendStatus(200);
    } catch (err) {
        return resp.status(500).send(err);
    }
});

app.post("/updateFavorite", async function(req, resp) {
    const time = req.body.time;
    const dateParam = req.body.date;
    const title = req.body.title;
    const song = req.body.song;
    const entry = req.body.entry;
    const favorite = req.body.favorite;

    const date = new Date(dateParam).toISOString().split("T")[0];
    const [year, month] = date.split("-");

    try {
        const collectionMonthUpdate = await client.db("jou").collection(year);
        const query = {
            month,
        };
        const currentElement = {
            time,
            date,
            title,
            song,
            entry,
            favorite,
        };
        const newElement = {
            time,
            date,
            title,
            song,
            entry,
            favorite: !favorite,
        };
        collectionMonthUpdate.updateOne(
            query, {
                $set: {
                    "entries.$[element]": newElement,
                },
            }, {
                arrayFilters: [{ element: currentElement }],
                upsert: false,
            }
        );
        return resp.sendStatus(200);
    } catch (err) {
        return resp.status(500).send(err);
    }
});

app.post("/deleteEntry", async function(req, resp) {
    const time = req.body.time;
    const dateParam = req.body.date;
    const title = req.body.title;
    const song = req.body.song;
    const entry = req.body.entry;
    const favorite = req.body.favorite;

    const date = new Date(dateParam).toISOString().split("T")[0];
    const [year, month] = date.split("-");

    try {
        const collectionMonthUpdate = await client.db("jou").collection(year);
        const query = {
            month,
        };
        const update = {
            $pull: {
                entries: {
                    time,
                    date,
                    title,
                    song,
                    entry,
                    favorite,
                },
            },
        };
        collectionMonthUpdate.updateOne(query, update);
        return resp.sendStatus(200);
    } catch (err) {
        return resp.status(500).send(err);
    }
});