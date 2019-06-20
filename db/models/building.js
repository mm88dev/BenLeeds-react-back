"use strict";

const mongoose = require("mongoose");

const BuildingSchema = mongoose.Schema({

    number: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});
// export Building constructor function
let Building = module.exports = mongoose.model("building", BuildingSchema);

// send all the buildings when app initializes
module.exports.getAllBuildings = function(dataToInit, res, callback) {

    Building.find({})
    .then(buildings => {
        let data = dataToInit;
        if (buildings !== null && buildings.length !== 0) {
            data.buildings = buildings;
        } else {
            data.error = "Could not get buildings";
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
};
// user gets a single instacne of a building
module.exports.getSingleBuilding = function(number, res, callback) {

    Building.findOne({
        number: number
    })
    .then(building => {

        let data;
        if (building !== null) {
            data = building;
        } else {
            data = {
                error: "Building with that number does not exist in BenLeeds database"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occurred while searching for a specific building " + err);
    });
};


