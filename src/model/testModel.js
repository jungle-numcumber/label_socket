// const { pool } = require("../../config/database");
// const mongoose = require('mongoose');
const Client = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test'

function dbCreate(id, value) {
    Client.connect(url, function(err, database) {
      if (err) throw err;
      dbFind(value);
      database.close();
    })
  }
  
 function dbFind(value) {
    Client.connect(url, async function(err, database) {
      if (err) throw err;
      let db = database.db('editors');
      let result = db.collection('editor').findOne({id: value.id});
      return Promise.all([result])
      .then(function(values){
        if(values[0]) {
          dbUpdate(value.id, value.pdfId, value.text);
          console.log('database updated');
          database.close();
        } else {
          dbInsert(value.id, value.pdfId, value.text);
          console.log('database inserted');
          database.close();
        }
      })
    })
  }

  // function dbSearch(id, pdfId) {
  //   Client.connect(url, async function(err, database) {
  //     if (err) throw err;
  //     let db = database.db('test');
  //     let result = db.collection('editors').findOne({id: 'ddong'});
  //     return Promise.all([result])
  //     .then(function(res,ref){
  //       console.log('in then',result)
  //       return result
  //     })
  //   })
  // }

// function dbCreate(id, value) {
//     Client.connect(url, function(err, database) {
//       if (err) throw err;
//       if (dbFind(value.id, value.pdfId)) {
//         dbUpdate(value.id, value.pdfId, value.text);
//         console.log('database updated');
//       } else {
//         dbInsert(value.id, value.pdfId, value.text);
//         console.log('database inserted');
//       }
//       database.close();
//     })
//   }
  
//  function dbFind(id, pdfId) {
//     Client.connect(url, async function(err, database) {
//       if (err) throw err;
//       let db = database.db('test');
//       let result = db.collection('editors').findOne({id: id});
//       console.log('result in find',result);
//       return result;
//     })
//   }

// function dbCreate(id, value) {
//   Client.connect(url, async function(err, database) {
//     if (err) throw err;
//     dbFind(value.id, value.pdfId).then((result) => {
//       console.log(result);
//       if (result) {
//         dbUpdate(value.id, value.pdfId, value.text);
//         console.log('database updated');
//       } else {
//         dbInsert(value.id, value.pdfId, value.text);
//         console.log('database inserted');
//       }
//       database.close();
//     })
//   })
// }

// function dbFind(id, pdfId) {
//   Client.connect(url, async function(err, database) {
//     if (err) throw err;
//     let db = database.db('test');
//     let result = db.collection('editors').findOne({id: id});
//     console.log('result in find',result);
//     return new Promise(result);
//   })
// }

function dbUpdate(id, pdfId, text) {
  Client.connect(url, async function(err, database) {
    if (err) throw err;
    let db = database.db('editors');
    let result = db.collection('editor').updateOne({id: id, pdfId: pdfId}, {$set: {text: text}});
    return result;
  })
}

function dbInsert(id, pdfId, text) {
  Client.connect(url, async function(err, database) {
    if (err) throw err;
    let db = database.db('editors');
    result = db.collection('editor').insertOne({id: id, pdfId: pdfId, text: text});
    return result;
  })
}

module.exports = {
    dbCreate,
    dbFind,
}