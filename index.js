const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const AWS = require('aws-sdk');
const {S3Client, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv')
const dbFind = require('./src/model/testModel').dbFind
const dbSearch = require('./src/model/testModel').dbSearch
const domain = 'tradingstudy.shop' // TODO : 구매한 도메인을 기재한다.

dotenv.config()
const option = {
  ca: fs.readFileSync('/etc/letsencrypt/live/' + domain+ '/fullchain.pem'),
  key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain+ '/privkey.pem'), 'utf8').toString(),
  cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain+ '/cert.pem'), 'utf8').toString(),
};

app.get('/test', (req, res) => {
  res.send('hello test');
})
// 미들웨어 압축, 파일 용량 줄임
app.use(compression());
app.use(express.json());
// restful api 중 put, delete를 사용하기 위해 씀
app.use(methodOverride());
// urlencoded 페이로드로 들어오는 요청을 분석, extended true는 qs 모듈을 써서 body parsing
app.use(express.urlencoded({extended: true}));
// 모든 도메인에서 나의 서버에게 요청을 보낼 수 있게 해줌
app.use(cors());

async function getSingedUrl(req, res) {
  console.log(process.env.BUCKET_REGION)
  const s3 = new AWS.S3({
      accessKeyID: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.BUCKET_REGION
  },
  )
  const params = {
      Bucket: process.env.S3_BUCKET,
      Key: req.body.fileName,
      // Key: "test"
  }
  
  const signedUrlPut = await s3.getSignedUrlPromise("putObject", params)
  console.log("S3 pre signed url: ",signedUrlPut);
  await res.json({signedUrlPut,})
};

app.post('/users/sign', getSingedUrl);
const sslport = process.env.PORT || 443;
const server = HTTPS.createServer(option, app);
const io = require('socket.io')(server, {});

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

server.listen(sslport, () => {
  console.log('[HTTPS] Server is started on port 443');
});



// // #!/usr/bin/env node
// const express = require('./config/express')
// const dbFind = require('./src/model/testModel').dbFind
// const dbSearch = require('./src/model/testModel').dbSearch
// const port = process.env.PORT || 3000
// // const server = require('http').createServer(app);
// const fs = require('fs');
// const https = require('https')
// const options = {
//   ca: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/privkey.pem', "utf8"),
//   cert: fs.readFileSync('/etc/letsencrypt/live/tradingstudy.shop/cert.pem', "utf8"),
// }
// const server = https.createServer(options, app).listen(3000, () => {
//   console.log('check');
// });
// // const io = require('socket.io')(server);
// console.log(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);


// // server.listen(3000, () => {
// //   console.log('Connected at 3000');
// // });

