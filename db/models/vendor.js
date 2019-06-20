"use strict";

const mongoose = require("mongoose");

const VendorSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        reqired: true
    },
    email: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    calendar: {
        type: Array
    }
});

// export Vendor constructor function
let Vendor = module.exports = mongoose.model("vendor", VendorSchema);

// admin get all vendors
module.exports.getAllVendors = function (res, callback) {

    Vendor.find({})
    .then(vendors => {
        let data;
        if (vendors !== null && vendors.length !== 0) {
            data = vendors;
        } else {
            data = {
                error: "No vendors avalailable"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting vendors " + err);
    });

};
// admin gets a single vendor
module.exports.getSingleVendor = function(id, res, callback) {

    Vendor.findById(id)
    .then(vendor => {
        let data;
        if (vendor !== null) {
            data = vendor;
        } else {
            data = {
                error: "No vendor for that id"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("An error occured while getting specific vendor : " + err);
    });
};
// admin inserts new vendor
module.exports.createVendor = function(vendor, res, callback) {

    let NewVendor = Vendor(vendor);
    NewVendor.save()
    .then(vendor => {
        let data;
        if (vendor._id !== undefined) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "Unsuccessfull attempt to insert a new vendor"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    });
};

// admin deletes an existing vendor
module.exports.deleteVendor = function(id, res, callback) {

    Vendor.findOneAndRemove({
        _id: mongoose.Types.ObjectId(id)
    })
    .then(result => {
        let data;
        if (result !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while trying to delete a single vendor" 
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while deleting specific vendor : " + err);
    });
};

// admin edits existing vendor
module.exports.editVendor = function(jobData, callback) {

    Vendor.findByIdAndUpdate(jobData.vendor.id, {
        $set : {
            firstName: jobData.vendor.firstName,
            lastName: jobData.vendor.lastName,
            email: jobData.vendor.email,
            profession: jobData.vendor.profession
        }
    },{
        new: true
    })
    .then(vendor => {
        let data;
        if (vendor !== null) {
            data = {
                workorder: jobData.workorder
            };
        } else {
            data = {
                error: "An error occured while updating a vendor"
            };
        }
        // send data further along
        callback(data);
        // send email to vendor with job details and date he's been assigned to
        let MailTask = require("../../tasks/mail");
        MailTask.adminSendMail(jobData); 
    })
    .catch(err => {

        console.log("An error occured while updating a vendor " + err);
    });
}; 
