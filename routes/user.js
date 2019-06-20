"use strict";
function callback(res, data) {
    res.send(data);
}


// get single room/building
exports.singleRoom = function(req, res) {

    let name = req.params.name;
    let Room = require("../db/models/room");
    Room.getSingleRoom(name, getItems);

    // based on the room name, get all the items assocciated with it
    function getItems(data) {
        // check if room data has been pulled
        if (data.error === undefined) {
            let Item = require("../db/models/item");
            Item.getRoomItems(data, res, callback);
        } else {
            // an error occured, send it to front
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
};
exports.singleBuilding = function(req, res) {

    let number = req.params.number;
    let Building = require("../db/models/building");
    Building.getSingleBuilding(number, res, callback);
};
// create new workorder
exports.createWorkorder = function(req, res) {

    let frontData;
    for (let prop in req.body) {
        frontData = JSON.parse(prop); 
    }
    let createdWorkorder = {
        workorder : frontData.workorder,
        jobs: frontData.jobs,
        user: frontData.workorder.user 
    };    
    let Workorder = require("../db/models/workorder");
    Workorder.createWorkorder(createdWorkorder, createJobs);

    function createJobs(data) {
        if (data.error === undefined) {
            let Job = require("../db/models/job");
            Job.createJobs(data, res, callback);
        } else {
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
};