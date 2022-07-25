// #!/usr/bin/env node
const express = require('./config/express')
const dbFind = require('./src/model/testModel').dbFind
const dbCreate = require('./src/model/testModel').dbCreate
const port = process.env.PORT || 3000
const server = require('http').createServer(express);
const io = require('socket.io')(server);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
const Client = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test'

function dbSearch(id, pdfId, socket) {
    Client.connect(url, async function(err, database) {
      if (err) throw err;
      let db = database.db('editors');
      let result = db.collection('editor').findOne({id: 'ddong', pdfId: 'pdf'});
      return Promise.all([result])
      .then(function(res,ref){
        console.log(res)
            io.emit('updateEditorOnce', res[0].text, ()=>{
            socket.on('updateEditor', (value) => {
            console.log(value)
            dbCreate('test', value);
            console.log(value.text);
            });
        });
      })
    })
  }
// editor room websocket connection
// 클라이언트로부터 connection 이벤트를 받는다. 
// ** handshake가 완료되면 emitted 된다.
io.on('connection', (socket) => {
    console.log('user connected');
    dbSearch('ddong', 'pdf', socket);

socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
  server.listen(3000, () => {
    console.log('Connected at 3000');
});

