"use strict";
const config = require('./config/default.json');
const express = require('express');
const MODELS = require("./models/index");
const universal = require('./constants/index')
const mongoose = require('mongoose');
const http = require("http");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const app = express();
const cors = require("cors");
const fs = require('fs');
app.use(cors());
app.options('*', cors());


process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local ser/ver

app.set("view engine", "html");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public/user/',express.static('user'))


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

/* Image API */
app.get('/:name', async(req, res, next) => {
  try {
    const userId = req.params.name;
    let imageData = await MODELS.user.find(MODELS.ObjectId(userId)).lean().exec();
    if(imageData) {
      let imageUrl = `http://localhost:${config.PORT}/public/user/${userId}.jpg`;
      console.log(`public/user/${userId}.jpg`);
      return await res.json(
        universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.FETCH_SUCCESS, imageUrl)
      )
    }
    return await res.json(
      universal.RESPONSE(universal.CODES.BAD_REQUEST, universal.MESSAGES.NO_DATA_FOUND, null)
    )
  } catch(err) {
    next(err);
  }
})

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
