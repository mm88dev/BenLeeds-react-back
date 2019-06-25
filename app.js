"use strict";
// enviorenment variables
const config = require("config");
// express-generator defaults
const http = require('http');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// database connection
const dbConnection = require("./db/connection"); 

const app = express();
// express-generator default middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// headers CORS set-up
app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
 });



// ROUTING

// send all items, buildings when app initializes
app.get("/", require("./routes/index").getOperationalData); 

// login
app.post("/login", require("./routes/index").login);

// user gets one instance of data
app.get("/user/rooms/:name", require("./routes/user").singleRoom);
app.get("/user/buildings/:number", require("./routes/user").singleBuilding);
// user creates a new instance of a workorder with multiple jobs created alongside it
app.post("/user/newWorkorder", require("./routes/user").createWorkorder);

// admin gets entire set of data
app.get("/admin", require("./routes/admin").allWorkorders);
app.get("/admin/vendors", require("./routes/admin").allVendors);
app.get("/admin/jobs", require("./routes/admin").allJobs);
app.get("/admin/users", require("./routes/admin").allUsers);
app.get("/admin/newItem", require("./routes/admin").allRooms);
// admin gets one instance of data
app.get("/admin/workorders/:id", require("./routes/admin").singleWorkorder);
app.get("/admin/vendors/:id", require("./routes/admin").singleVendor);
app.get("/admin/jobs/:id", require("./routes/admin").singleJob);
app.get("/admin/users/:id", require("./routes/admin").singleUser);
app.get("/admin/rooms/:name", require("./routes/admin").singleRoom);
app.get("/admin/items/:id", require("./routes/admin").singleItem);
// admin creates a new instance of vendor/user/item 
app.post("/admin/newVendor", require("./routes/admin").createVendor);
app.post("/admin/newUser", require("./routes/admin").createUser);
app.post("/admin/newItem", require("./routes/admin").createItem);
// admin edits one instance of data
app.post("/admin/editWorkorder/:id", require("./routes/admin").editWorkorder);
app.post("/admin/editVendor/:id", require("./routes/admin").editVendor);
app.post("/admin/editUser/:id", require("./routes/admin").editUser);
app.post("/admin/editItem/:id", require("./routes/admin").editItem);
// admin assigns job, editing job, vendor and optionally also workorder
app.post("/admin/assignJob/:id", require("./routes/admin").assignJob);
app.post("/admin/finishJob/:id", require("./routes/admin").finishJob);
// admin deletes one insance of data
app.post("/admin/vendors/:id", require("./routes/admin").deleteVendor);
app.post("/admin/users/:id", require("./routes/admin").deleteUser);
app.post("/admin/items/:id", require("./routes/admin").deleteItem);


// serve react in production
if (config.get("NODE_ENV") === 'production') {
  
  app.use(express.static("client/build"));
  // route that's not among the route defined above
  app.get("*", function(req, res) {

    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log("Something went wrong : ");
  console.log(err);
});

module.exports = app;
