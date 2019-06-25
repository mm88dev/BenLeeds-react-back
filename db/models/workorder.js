"use strict";

const mongoose = require("mongoose");
// create workorder Schema
const workorderSchema = mongoose.Schema({

    buildingNumber: {
        type: Number,
        required: true
    },
    apartmentNumber: {
        type: Number,
        required: true
    },
    loginTime: {
        type: Date, 
        required: true
    },
    completedTime: {
        type: Date, 
        required: true
    }, 
    sendTime: {
        type: Date, 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    }             
});
// export Workorder constructor 
let Workorder = module.exports = mongoose.model("workorder", workorderSchema);

// admin gets all workorders
module.exports.getAllWorkorders = function(callback) {

    Workorder.find({})
    .then(workorders => {
        let data;
        if (workorders !== null) {
            data = workorders;
        } else {
            data = {
                error: "Could not get workorders"
            };
        }
        callback(data);
    })
    .catch(err => {
        console.log("An error occurred while getting workorders : " + err);
    });
};
// admin gets a single workorder
module.exports.getSingleWorkorder = function(id, callback) {

    Workorder.findById(id)
    .then(workorder => {
        let data;
        if (workorder !== null) {
            data = workorder;
        } else {
            data = {
                error: "No workorder for that id" 
            };
        }
        callback(data);
    })
    .catch(err => {
        console.log("An error occurred while getting specific workorder : " + err);
    });
};
// admin gets workorders associated with an instance of a user
module.exports.getUserWorkorders = function(user, res, callback) {

    Workorder.find({
        userId: mongoose.Types.ObjectId(user._id)
    })
    .then(workorders => {

        let data;
        if (workorders !== null) {
            data = {
                user: user,
                workorders: workorders
            };
        } else {
            data = {
                user: user,
                error: "Could not get workorders associated with that user"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occurred while getting workorder associated with a specific user " + err);
    });
};

// user inserts new workorder
module.exports.createWorkorder = function(workorderData, callback) {

    let NewWorkorder = Workorder(workorderData.workorder);
    NewWorkorder.save()
    .then(workorder => {
        let data;
        if (workorder !== null) {
            // add jobs to data passed further
            data = workorderData;
            // add workorederId to each joobs
            data.jobs.forEach(job => {
                job.workorderId = workorder._id
            });
        } else {
            data = {
                error: "Unsuccessfull attempt to insert a new workorder"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occurred while inserting new workorder " + err);
    });
};

// admin edits existing workorder
module.exports.editWorkorder = function(jobData, res, callback) {

    Workorder.findByIdAndUpdate(jobData.workorder.id, {
        $set : {
            status: jobData.workorder.status
        }
    },{
        new: true
    })
    .then(workorder => {
        let data;
        if (workorder !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while updating a workorder"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while updating a workorder " + err);
    });
};  