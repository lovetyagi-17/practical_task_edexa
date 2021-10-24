"use strict";
const config = require('./config/default.json');
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const app = express();
const cors = require("cors");
app.use(cors());
app.options('*', cors());


process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local ser/ver

app.set("view engine", "html");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads',express.static('uploads'))


// All api requests
app.use(function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data"
  );

  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

// start server
let server = require("http").createServer(app);
server.listen(config.PORT, () => {
  console.log(`****************************************** ${'ENVIRONMENT:::' + process.env.NODE_ENV} *******************************************************`);
  console.log(`****************************************** ${'PORT:::' + config.PORT} *******************************************************`);
})

/*
Database Connection
*/
mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  (db) => console.log(`****************************************** MONGODB CONNECTED ***********************************************`),
  (err) => console.log("MongoDB " + String(err.message))
);

/* TEST API */
app.use('/test', async(req, res, next) => {
  res.status(200).send({
    status: 200, message: "TEST API",
    data: {}
  })
});

/* API ROUTES */
const route = require('./route');
app.use('/api', route)


/* Catch 404 Error */
app.use(async (req, res, next) => {
  res.status(404).send({
    status: 404,
    message: "Invalid Route",
    data: {}
  })
});
