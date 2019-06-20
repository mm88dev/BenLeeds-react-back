"use strict";
// transfer data / message to frontend query into database
function callback(res, data) {
  res.send(data);
}
// send all the items/building
exports.getOperationalData = function(req, res) {

  let Item = require("../db/models/item");
  Item.getAllItems(getBuildings);

  function getBuildings(data) {
    if (data.error === undefined) {
      let Building = require("../db/models/building");
      Building.getAllBuildings(data, res, callback);
    } else {
      data = JSON.stringify(data);
      callback(res, data)
    }
  } 
};
// login admin/user function
exports.login = function(req, res) {

  let email = req.body.email;
  let password = req.body.password;
  if (email === process.env.ADMIN_EMAIL) {
    // admin login attempt
    if (password === process.env.ADMIN_PASSWORD) {
      // admin login attempt success
      res.send("admin");
    } else {
      // admin login attempt failed password
      res.send("bad password");
    }
  } else {
    // user login attempt
    let User = require("../db/models/user");
    User.userLogin(email, password, res, callback);
  }
};
