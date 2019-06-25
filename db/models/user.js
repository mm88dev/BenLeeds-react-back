"use strict";

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
// create user Schema
const UserSchema = mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        bcrypt: true,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    }
});
// export User constructor
let User = module.exports = mongoose.model("user", UserSchema);

// *** render page here from here, not from frontend
// user login
module.exports.userLogin = function(email, password, res, callback) {
    // find out if that email exists
    User.findOne({
        email: email
    })
    .then(user => {
        if (user === null) {
            // no such email adress
            callback(res, "no email");
        } else {
            // compare password to the hashed user.password database
            bcryptjs.compare(password, user.password, function (err, result) {

                if (err) throw err;
                let data;
                if (result === true) {
                    data = user;
                } else {
                    data = "bad password";
                }
                data = JSON.stringify(data);
                callback(res, data);
            });
        }
    })
    .catch(err => {
        console.log("Error occured while searching for user : " + err);
    });
};

// admin gets all users
module.exports.getAllUsers = function(res, callback) {

    User.find({})
    .then(users => {
        let data;
        if (users !== null) {
            data = users;
        } else {
            data = {
                error: "Could not get users"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {
        console.log("Error while getting users : " + err);
    });
};
// admin gets a single user
module.exports.getSingleUser = function(id, callback) {

    User.findById(id)
    .then(user => {
        let data;
        if (user !== null) {
            data = user;
        } else {
            data = {
                error: "No user with that id exists" 
            };
        }
        callback(data);
    })
    .catch(err => {
        console.log("Error while getting specific user : " + err);
    });
};


// admin creates a new user 
module.exports.createUser = function(user, res, callback) {
    // check if email already exists
    User.findOne({
        email: user.email
    })
    .then(userData => {
    
        if (userData !== null) {
            let data = {
                error: "That email already exists"
            };
            data = JSON.stringify(data);
            callback(res, data);
        } else {
            // generate salt async
            bcryptjs.genSalt(10, function (err, salt) {
                
                if (err) throw err;
                else {
                    // hash user password async
                    bcryptjs.hash(user.password, salt, function (err, hash) {

                        if (err) throw err;
                        else {
                            // everything ok, replace passowrd with hash
                            user.password = hash;
                            let NewUser = User(user);
                            NewUser.save()
                            .then(user => {

                                let data;
                                if (user !== null) {
                                    data = {
                                        success: "Ok"
                                    };
                                } else {
                                    data = {
                                        error: "Unsuccessfull attempt to insert a new user"
                                    };
                                }
                                data = JSON.stringify(data);
                                callback(res, data);
                            })
                            .catch(err => {

                                console.log("An error1 occured while trying to register a new user " + err);
                            });
                        }
                    });
                }
            });      
        }
    })
    .catch(err => {
        console.log("An error2 occured while trying to register a new user " + err);
    });
};

// admin deletes an existing user
module.exports.deleteUser = function(id, res, callback) {

    User.findOneAndRemove({
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
                error: "An error occured while trying to delete an user"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while deleting specific user : " + err);
    });
};
// admin edits existing user
module.exports.editUser = function(user, res, callback) {

    User.findByIdAndUpdate(user.id, {
        $set : {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            emailPassword: user.emailPassword,
            region: user.region
        }
    },{
        new: true
    })
    .then(user => {
        let data;
        if (user !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while updating a user"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while updating a user " + err);
    });
};  

// add relevant user to each workorder send to front
module.exports.addUserToWorkorder = function(workorders, res, callback) {

    User.find({})
    .then(users => {
        let data;
        if (users !== null && users.length !== 0) {

            let updatedWorkorders = [];
            for  (let i = 0; i < workorders.length; i++) {
                let workorderUser;
                let workorderUserId = workorders[i].userId.toString();
                for (let j = 0; j < users.length; j++) {
                    let id = users[j]._id.toString();
                    if (workorderUserId == id) {
                        workorderUser = users[j];
                    }
                }
                updatedWorkorders.push({
                    _id : workorders[i]._id,
                    buildingNumber: workorders[i].buildingNumber,
                    apartmentNumber: workorders[i].apartmentNumber,
                    status: workorders[i].status,
                    loginTime: workorders[i].loginTime,
                    completedTime: workorders[i].completedTime,
                    sendTime: workorders[i].sendTime,
                    user: workorderUser
                });
            }
            data = updatedWorkorders;
        } else {
            data = {
                workorders: workorders,
                error: "An error occured trying to get users data"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
};