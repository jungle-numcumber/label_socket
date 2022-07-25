// #!/usr/bin/env node
const express = require('./config/express')
const dbFind = require('./src/model/testModel').dbFind
const port = process.env.PORT || 3000
const server = require('http').createServer(express);
const io = require('socket.io')(server);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
const Client = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/editors'

function dbSearch(id, pdfId, socket) {
    Client.connect(url, async function(err, database) {
      if (err) throw err;
      let db = database.db('editors');
      let result = db.collection('editor').findOne({id: id, pdfId: pdfId});
      return Promise.all([result])
      .then(function(res,ref){
        console.log('result',res)
        let defaultPage = ""
        if (result !== null) {
          console.log('result?',res[0].text)
          defaultPage = res[0].text;
        }
        io.emit('updateEditorOnce', defaultPage, ()=>{
          socket.on('updateEditor', (value) => {
            dbFind(value);
            console.log(value.text);
          });
        });
        database.close();
      })
      .catch(err => {
        console.log(err)
        database.close();
      })
    })
  }
// editor room websocket connection
// 클라이언트로부터 connection 이벤트를 받는다. 
// ** handshake가 완료되면 emitted 된다.
io.on('connection', (socket) => {
  console.log('user connected');
  dbSearch(socket.request._query.userId, socket.request._query.pdfId, socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Connected at 3000');
});

