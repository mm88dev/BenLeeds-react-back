"use strict";
// establishing a connection to mongoAtlas
const mongoose = require("mongoose");
const dbURI = require("config").get("DB_URI");
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    dbName: "benLeeds"
});
const db = mongoose.connection;
// conenction error
db.on("error", function(err) {

    console.log("Error occured while connecting to mongoAtlas : " + err);
});
db.on("open", function() {

    console.log("Connection to mongoAtlas is now open");
});

module.exports = db;
