const express = require("express");
const fs = require("fs");
const parse = require("csv-parse");
const Max = require("max-api");
const open = require('open');

const app = express();

(async () => {

  await open('http://localhost:5000/sound/1?track=3',{wait: false}, {app: 'google chrome'});
	console.log('got in 0');
	await open('http://localhost:5000/sound/1?track=4', {wait: false}, {app: 'google chrome'});
	console.log('got in 1');
	await open('http://localhost:5000/sound/1?track=2', {wait: false}, {app: 'google chrome'});
	console.log('got in 2');

})();

app.get("/sound/:id", (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept"
    // );
  
    const parser = parse({}, (_err, data) => {
      if (Max) Max.outlet({ [req.query.track]: data[req.params.id] });
  
      res.sendStatus(200);
    });
  
    fs.createReadStream(__dirname + "/public/messages/sounds.csv").pipe(parser);
  });

  app.get("/sound/:id", (req, res) => {
    const parser = parse({}, (_err, data) => {
      if (Max) Max.outlet({ [req.query.track]: data[req.params.id] });
  
      res.sendStatus(200);
    });

     fs.createReadStream(__dirname + "/public/messages/data.json");
  });
  app.listen(5000);
