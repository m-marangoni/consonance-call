const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
//const { v4 } = require('uuid');
'use strict';
const util = require('util');
var async = require('async');

const ioHook = require('iohook');

let myID

const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

// make sure messages folder exists
const messageFolder = './public/messages/';
if (!fs.existsSync(messageFolder)) {
  fs.mkdirSync(messageFolder);
}
// fs.readdir( './public/messages', (error, files) => { 
//   let totalFiles = files.length; // return the number of files
//   console.log(totalFiles); // print the total number of files
//    myID = totalFiles + 1;
// });

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/messages', (req, res) => {
  readdir(messageFolder)
    .then(messageFilenames => {
      res.status(200).json({ messageFilenames });
      let totalFiles = messageFilenames.length; // return the number of files
  console.log(totalFiles); // print the total number of files
   myID = totalFiles + 1;
    })
    .catch(err => {
      console.log('Error reading message directory', err);
      res.sendStatus(500);
    });
});

app.post('/messages', (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'No req.body.message' });
  }
 //const messageId =  v4();


 writeFile(messageFolder + "sound" + myID + ".wav", req.body.message, 'base64')
 .then(() => {
      res.status(201).json({ message: 'Saved message' });
    })
    .catch(err => {
      console.log('Error writing message to file', err);
      res.sendStatus(500);
    });
});

ioHook.on('mousedrag', event => {  
 fs.writeFileSync('./public/messages/data.json', JSON.stringify(event) , 'utf-8');
});

// Register and start hook
ioHook.start();



// dir.readFiles(
 
//   './public/messages/', // the root path

//   // an options object
//   {

//       match: /.wav$/, // only match json files
//       recursive: false // only the root dir

//   },

//   function (err, content, filename, next) {

//       if (err) {

//           console.log(err);

//       } else {

//           console.log(filename);
//            next(); // next file

//       }

//   }

// );


// function findAndRemoveOldFiles(inputDir, keepCount, callback) {
//   if(!callback) {
//       callback = function (err, removeFiles) {
//           // default callback: doing nothing
//       };
//   };

//   fs.readdir(inputDir, function (err, files) {
//       if(err) {
//           return callback(err);
//       }

//       fileNames = files.map(function (fileName) {
//           return "./public/messages/".join(inputDir, fileName);   
//       });

//       async.map(fileNames, function (fileName, cb) {
//           fs.stat(fileName, function (err, stat) {
//               if(err) {
//                   return cb(err);
//               };

//               cb(null, {
//                   name: fileName,
//                   isFile: stat.isFile(),
//                   time: stat.mtime,
//               });
//           });
//       }, function (err, files) {

//           if(err) {
//               return callback(err);
//           };

//           files = files.filter(function (file) {
//               return file.isFile;
//           })

//           files.sort(function (filea, fileb) {
//               return filea.time < fileb.time;
//           });

//           files = files.slice(keepCount);

//           async.map(files, function (file, cb) {
//               fs.unlink(file.name, function (err) {
//                   if(err) {
//                       return cb(err);
//                   };

//                   cb(null, file.name);
//               });
//           }, function (err, removedFiles) {
//               if(err) {
//                   return callback(err);
//               }
//               callback(null, removedFiles);
//           });
//       });
//   });
// }

// function watchAndRemoveOldFiles(inputDir, keepCount, callback) {
//   findAndRemoveOldFiles(inputDir, keepCount, callback);
//   fs.watch(inputDir, function () {
//       findAndRemoveOldFiles(inputDir, keepCount, callback);
//   });
// }

// // USAGE: watch and remove old files, keep only 5 newest files
// watchAndRemoveOldFiles('./public/messages/', 7, function (err, removeFiles) {
//   console.log('These files has been removed:', removeFiles);
// });





const PORT = process.env.PORT || 3545;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

