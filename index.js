// #!/usr/bin/env node
const express = require('./config/express')
const dbFind = require('./src/model/testModel').dbFind
const dbSearch = require('./src/model/testModel').dbSearch
const port = process.env.PORT || 3000
const server = require('http').createServer(express);
const io = require('socket.io')(server);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// editor room websocket connection
// 클라이언트로부터 connection 이벤트를 받는다. 
// ** handshake가 완료되면 emitted 된다.
io.on('connection', async (socket) => {
  console.log('user connected');
  let result = await dbSearch(socket.request._query.userId, socket.request._query.pdfId);
  let defaultPage = ""
  if (result !== null) {
    console.log('result?',result['text'])
    defaultPage = result['text'];
  }

  io.emit('updateEditorOnce', defaultPage, ()=>{
    socket.on('updateEditor', (value) => {
      dbFind(value);
      console.log(value.text);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Connected at 3000');
});

