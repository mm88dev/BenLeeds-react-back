"use strict";
// transfer data or success/fail message to frontend after query into database
function callback(res, data) {
    res.send(data);
}


// get all workorders/vendor/jobs/users/items data at once
exports.allWorkorders = function(req, res) {

    let Workorder = require("../db/models/workorder");

    Workorder.getAllWorkorders(allUsers);
    
    function allUsers(data) {

        if (data.error === undefined) {
            const User = require("../db/models/user");
            User.addUserToWorkorder(data, res, callback);
        } else {
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
}; 
exports.allVendors = function(req, res) {

    let Vendor = require("../db/models/vendor");
    Vendor.getAllVendors(res, callback);
};
exports.allJobs = function(req, res) {

    let Job = require("../db/models/job");
    Job.getAllJobs(res, callback);
};
exports.allUsers = function(req, res) {

    let User = require("../db/models/user");
    User.getAllUsers(res, callback);
};
exports.allRooms = function(req, res) {

    let Room = require("../db/models/room");
    Room.getAllRooms(res, callback);
};


// get one instance of a workorder/vendor/job/user/room/item
exports.singleWorkorder = function(req, res) {

    let id = req.params.id;
    let Workorder = require("../db/models/workorder");
    Workorder.getSingleWorkorder(id, getJobs);

    // based on the workorder id, get all the jobs assocciated with it
    function getJobs(data) {
        // check if workorder data has been pulled
        if (data.error === undefined) {
            let Job = require("../db/models/job");
            Job.getWorkorderJobs(data, res, callback);
        } else {
            // an error occured, send it to front
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
};
exports.singleVendor = function(req, res) {

    let id = req.params.id;
    let Vendor = require("../db/models/vendor");
    Vendor.getSingleVendor(id, res, callback);
};  
exports.singleJob = function(req, res) {

    let id = req.params.id;
    let Job = require("../db/models/job");
    Job.getSingleJob(id, res, callback);
};  
exports.singleUser = function(req, res) {

    let id = req.params.id;
    let User = require("../db/models/user");
    User.getSingleUser(id, getWorkorders);

    // based on the user firstName and user lastName, get all the workorders assocciated with him/her
    function getWorkorders(data) {
        // check if user data has been pulled
        if (data.error === undefined) {
            let Workorder = require("../db/models/workorder");
            Workorder.getUserWorkorders(data, res, callback);
        } else {
            // an error occured, send it to front
            data = JSON.stringify(data);
            callback(res, data);
        }
    }    
};
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
exports.singleItem = function(req, res) {

    let id = req.params.id;
    let Item = require("../db/models/item");
    Item.getSingleItem(id, res, callback);
};


// create new vendor/user/item
exports.createVendor = function(req, res) {
    
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let calendarEnd = day + 100;
    // return number of days in a month
    function daysInMonth(month, year) {

        switch(month) {

            case 1:
                return 31;
                break;
            case 2:
                if ((year % 4) === 0) {
                    return 29;
                } else {
                    return 28;
                }
                break;
            case 3:
                return 31;
                break;
            case 4:
                return 30;
                break;
            case 5:
                return 31;
                break;
            case 6:
                return 30;
                break;   
            case 7:
                return 31;
                break;
            case 8:
                return 31;
                break;
            case 9:
                return 30;
                break;
            case 10:
                return 31;
                break;
            case 11:
                return 30;
                break;
            case 12:
                return 31;
                break;                                                                                                                                                                  
            default:
                break;
        }
    };
    // format date
    function formatDate(day, month, year) {

        let mm = month < 10 ? "0" + month : "" + month;
        let dd = day < 10 ? "0" + day : "" + day;
        let yyyy = "" + year;
        return mm + "-" + dd + "-" + yyyy; 
    } 
    let calendar = [];
    for (let i = day; i < calendarEnd; i++) {
        let dateTime = formatDate(day, month, year);
        calendar.push({
            date: dateTime,
            busy: false
        });
        // increase day
        day++;
        // optionally increase month
        if (day > daysInMonth(month, year)) {
            month++;
            day = 1;
            // optionally increase year
            if (month > 12) {
                year++;
                month = 1;
            }
        }
    } 
    // get new vendor data
    let createdVendor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profession: req.body.profession,
        calendar: calendar
    };
    let Vendor = require("../db/models/vendor");
    Vendor.createVendor(createdVendor, res, callback);
};
exports.createUser = function(req, res) {

    // get new user data
    let createdUser = {
        email: req.body.email,
        password: req.body.password,
        emailPassword: req.body.emailPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        region: req.body.region
    };
    let User = require("../db/models/user");
    User.createUser(createdUser, res, callback);
}; 
exports.createItem = function(req, res) {

    let createdItem = {

        name: req.body.name,
        subCategory: req.body.subCategory,
        room: req.body.room,
        price: req.body.price
    };
    let Item = require("../db/models/item");
    Item.createItem(createdItem, res, callback);
};

// edit existing workorder/vendor/job/user/item
exports.editWorkorder = function(req, res) {

    let editedWorkorder = {
        id : req.params.id,
        buildingNumber: req.body.buildingNumber,
        apartmentNumber: req.body.apartmentNumber,
        loginTime: req.body.loginTime,
        sendTime: req.body.sendTime,
        completedTime: req.body.completedTime,
        userId: req.body.userId,
        status: req.body.status
    };
    let Workorder = require("../db/models/workorder");
    Workorder.editWorkorder(editedWorkorder, res, callback);
}; 
exports.editVendor = function(req, res) {

    let editedVendor = {
        id: req.params.id,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        profession: req.body.profession,
        calendar: req.body.calendar
    };
    let Vendor = require("../db/models/vendor");
    Vendor.editVendor(editedVendor, res, callback);
};
exports.editUser = function(req, res) {

    let editedUser = {
        id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        emailPassword: req.body.emailPassword,
        region: req.body.region
    };
    let User = require("../db/models/user");
    User.editUser(editedUser, res, callback);
}; 
exports.editItem = function(req, res) {

    let editedItem = {
        id: req.params.id,
        name: req.body.name,
        subCategory: req.body.subCategory,
        room: req.body.room,
        price: req.body.price
    };
    let Item = require("../db/models/item");
    Item.editItem(editedItem, res, callback);
}; 
// assign job to vendor, optionally change that workorder status
exports.assignJob = function(req, res) {
    
    let frontData;
    for (let prop in req.body) {
        frontData = JSON.parse(prop);
    }
    let jobData = {
        job: frontData.job,
        vendor: frontData.vendor,
        workorder: frontData.workorder
    };
    let Job = require("../db/models/job");
    Job.assignJob(jobData, assignVendor);
    // edit vendor data
    function assignVendor(data) {
        if (data.error === undefined) {
            let Vendor = require("../db/models/vendor");
            Vendor.assignVendor(data, editWorkorder);
        } else {
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
    // optionally edit workorder data
    function editWorkorder(data) {
        if (data.error === undefined) {
            if (data.workorder.status === "pending") {
                // workorder remains tha same, go back to front
                let data = {
                    success: "Ok"
                };
                data = JSON.stringify(data);
                callback(res, data)
            } else {
                // workorder status has changed, go to workorder model
                let Workorder = require("../db/models/workorder");
                Workorder.editWorkorder(data, res, callback)
            }
        } else {
            data = JSON.stringify(data);
            callback(res, data);
        }
    }
};
// set job status to finished
exports.finishJob = function(req, res) {

    const jobData = {
        id: req.params.id,
        status: req.body.status
    };
    const Job = require("../db/models/job");
    Job.finishJob(jobData, res, callback);
};
// delete existing vendor/user/item
exports.deleteVendor = function(req, res) {

    let id = req.params.id;
    let Vendor = require("../db/models/vendor");
    Vendor.deleteVendor(id, res, callback);
};
exports.deleteUser = function(req, res) {

    let id = req.params.id;
    let User = require("../db/models/user");
    User.deleteUser(id, res, callback);
};
exports.deleteItem = function(req, res) {

    let id = req.params.id;
    let Item = require("../db/models/item");
    Item.deleteItem(id, res, callback);
};