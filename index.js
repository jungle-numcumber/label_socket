// #!/usr/bin/env node
const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const app = express();
// const express = require('./config/express')
const dbFind = require('./src/model/testModel').dbFind
const dbSearch = require('./src/model/testModel').dbSearch
const port = process.env.PORT || 3000
// const server = require('http').createServer(app);
const fs = require('fs');
const https = require('https')
const options = {
  ca: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/fullchain.pem', "utf8"),
  key: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/privkey.pem', "utf8"),
  cert: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/cert.pem', "utf8"),
}
const server = https.createServer(options, app);
const io = require('socket.io')(server);
console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// 미들웨어 압축, 파일 용량 줄임
app.use(compression());
app.use(express.json());
// restful api 중 put, delete를 사용하기 위해 씀
app.use(methodOverride());
// urlencoded 페이로드로 들어오는 요청을 분석, extended true는 qs 모듈을 써서 body parsing
app.use(express.urlencoded({extended: true}));
// 모든 도메인에서 나의 서버에게 요청을 보낼 수 있게 해줌
app.use(cors());
app.get('/', (req, res) => {
  res.send('hello world');
})
app.get('/test', (req, res) => {
  res.send('hello test');
})
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

