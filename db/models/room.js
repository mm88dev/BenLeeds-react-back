"use strict";

const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    }
});

// export Room constructor
let Room = module.exports = mongoose.model("room", RoomSchema);

// admin or user gets a single room
module.exports.getSingleRoom = function(name, callback) {

    Room.findOne({
        name: name
    })
    .then(room => {
        let data;
        if (room !== null) {
            data = room;
        } else {
            data = {
                error: "That room instance does not exist"
            };
        }
        callback(data);
    })
    .catch(err => {
        console.log("An error occurred while searching for a specific room " + err);
    });
};
// admin gets all rooms to display in newItem form select element
module.exports.getAllRooms = function(res, callback) {

    Room.find({})
    .then(rooms => {
        
        let data;
        if (rooms !== null && rooms.length !== 0) {
            data = rooms; 
        } else {
            data = {
                error: "Not a single room instance exists at this moment"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while searching for rooms " + err);
    });
};