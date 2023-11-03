/******************************************************************************
 *  *** * ITE5315 – Assignment 2 * I declare that this assignment is my own work in accordance with Humber Academic Policy. * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. * * Name: Jigar Mehta Student ID: N01544131 Date: 03/11/2023
 * * * ****************************************************************************** **/
//Depandancies called
var express = require("express");
var path = require("path");
const fs = require("fs");
var app = express();
const exphbs = require("express-handlebars");
const port = process.env.port || 3000;
const hbs = require("hbs");
//Middleware to give access to the static files

app.use(express.static(path.join(__dirname, "public")));
//handlebars are called

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
//Index route

app.get("/", function (req, res) {
  res.render("index", {
    title: "Express",
  });
});

hbs.handlebars.registerHelper("eq", function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper("displayClass", (classValue) => {
  if (classValue === "blank") {
    return "unknown";
  } else {
    return classValue;
  }
});

//Data route

app.get("/data", (req, res) => {
  fs.readFile("ite5315-A1-Car_sales.json", "utf8", (err, data) => {
    const cardata = JSON.parse(data);
    res.render("DataCAR", { carData: cardata.carSales });
  });
});

//Search data by index route

app.get("/search/indexNo/:index", (req, res) => {
  fs.readFile("ite5315-A1-Car_sales.json", "utf8", (err, data) => {
    const cardata = JSON.parse(data);
    const index = req.params.index;
    if (typeof cardata.carSales[index] === "undefined") {
      res.render("errorData");
    } else {
      res.render("DataCARIndex", { DataCARIndex: cardata.carSales[index] });
    }
  });
});

//Invoice form

app.get("/search/invoiceNo", (req, res) => {
  res.render("form");
});

//Invoice post form

app.use(express.urlencoded({ extended: true }));

app.post("/search/invoiceNo", (req, res) => {
  const { invoiceNo } = req.body;
  var recievedData = null;
  fs.readFile("ite5315-A1-Car_sales.json", "utf-8", (err, data) => {
    const convertedData = JSON.parse(data);
    convertedData.carSales.forEach((element) => {
      if (element.InvoiceNo === invoiceNo) {
        recievedData = element;
      }
    });
    res.render("invoiceFORM", { invoiceFORM: recievedData });
    console.log(recievedData);
  });
});
//Invoice form

app.get("/search/Manufacturer", (req, res) => {
  res.render("manuForm");
});

//Invoice post form

app.use(express.urlencoded({ extended: true }));

app.post("/search/Manufacturer", (req, res) => {
  const { Manufacturer } = req.body;
  var recievedData = [];
  fs.readFile("ite5315-A1-Car_sales.json", "utf-8", (err, data) => {
    const convertedData = JSON.parse(data);
    convertedData.carSales.forEach((element) => {
      if (element.Manufacturer === Manufacturer) {
        recievedData.push(element);
      }
    });
    res.render("Manufacturer", { Manufacturer: recievedData });
  });
});

//All data route
app.get("/allData", (req, res) => {
  fs.readFile("ite5315-A1-Car_sales.json", "utf-8", (err, data) => {
    const convertedData = JSON.parse(data);
    res.render("allData", { data: convertedData.carSales });
  });
});

//Filtered Data route

app.get("/filteredData", (req, res) => {
  fs.readFile("ite5315-A1-Car_sales.json", "utf-8", (err, data) => {
    const convertedData = JSON.parse(data);
    const filteredData = convertedData.carSales.filter(
      (car) => car.Vehicle_type !== ""
    );
    res.render("filteredData", { data: filteredData });
  });
});

//Users route
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});
//Errors route
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

//Listining to port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
