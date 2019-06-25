"use strict";

const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    comment: {
        type: String, 
        required: true
    },
    workorderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
    }, 
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    assignmentDate: {
        type: String,
        default: ""
    }    
});

// export Job constructor function
let Job = module.exports = mongoose.model("job", JobSchema);

// admin gets all jobs
module.exports.getAllJobs = function(res, callback) {

    Job.find({})
    .then(jobs => {
        let data;
        if (jobs !== null) {
            data = jobs;
        } else {
            data = {
                error: "No workorders avalailable"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting jobs : " + err);
    });
};
// admin gets a single workorder
module.exports.getSingleJob = function(id, res, callback) {

    Job.findById(id)
    .then(job => {
        let data;
        if (job !== null) {
            data = job;
        } else {
            data = {
                error: "No job for that id"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting specific job : " + err);
    });
};
// admin gets jobs associated with an instance of a workorder
module.exports.getWorkorderJobs = function(workorder, res, callback) {

    Job.find({
        workorderId: mongoose.Types.ObjectId(workorder._id)
    })
    .then(jobs => {
        let data;
        if (jobs !== null) {
            data = {
                workorder: workorder,
                jobs: jobs
            };
        } else {
            data = {
                workorder: workorder,
                error: "There are no jobs associated with that workorder"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting jobs associated with a specific workorder : " + err);
    });
};



// following a workorder insert an array of jobs is inserted
module.exports.createJobs = function(workorderData, res, callback) {

    let NewJobs = [];
    for (let i = 0; i < workorderData.jobs.length; i++) {
        let newJob = Job(workorderData.jobs[i]);
        NewJobs.push(newJob);
    }
    Job.insertMany(NewJobs)
    .then(jobs => {

        let data;
        if (jobs !== null) {
            data = {
                success: "ok"
            };
        } else {
            data = {
                error: "No jobs assocciated with that workodata"
            };
        }
        data = JSON.stringify(data);
        // send information about insert to front
        callback(res, data);
        // send email with workorder && user data to admin
        let MailTask = require("../../tasks/mail");
        MailTask.userSendMail(workorderData);
    })
    .catch(err => {

        console.log("An error occurred while inserting jobs " + err);
    });
};

// admin assigns job to a vendor
module.exports.assignJob = function(jobData, callback) {

    Job.findByIdAndUpdate(jobData.job.id, {
        $set : {
            vendorId: jobData.job.vendorId,
            status: jobData.job.status,
            jobAsssignment: jobData.job.jobAsssignment
        }
    },{
        new: true
    })
    .then(job => {
        let data;
        if (job !== null) {
            // job edited successfully, pass vendor and workorder data further along
            data = jobData;
        } else {
            data = {
                error: "An error occured while updating a job"
            };
        }
        callback(data);
    })
    .catch(err => {

        console.log("An error occured while updating a job " + err);
    });
};  
// admin declares job finished
module.exports.finishJob = function(jobData, res, callback) {

    Job.findByIdAndUpdate(jobData.id, {
        $set: {
            status: jobData.status
        }
    }, {
        new: true
    })
    .then(job => {
        let data;
        if (job !== null) {
            data = {
                success: "Ok"
            }; 
        } else {
            data = {
                error: "An error occurred while declaring a job finished"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while declaring a job finished " + err);
    }); 
};