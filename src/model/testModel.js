// const { pool } = require("../../config/database");
const { connection } = require('mongoose');
const Client = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/editors'
  
function dbFind(value) {
  Client.connect(url, async function(err, database) {
    if (err) throw err;
    let db = database.db('editors');
    let result = db.collection('editor').findOne({id: value.id, pdfId: value.pdfId});
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

async function dbSearch(id, pdfId) {
  let conn = await Client.connect(url);
  let db = conn.db('editors');
  let result = await db.collection('editor').findOne({id: id, pdfId: pdfId});
  await conn.close();
  return result;
}

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
    dbFind,
    dbSearch
}

// async await 적용 실패사례

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

// async function dbCreate(id, value) {
//     let a = await Client.connect(url, function(err, database) {
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