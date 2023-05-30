import express, { Request, Response } from 'express';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import HTTPS from 'https';
import dotenv from 'dotenv';
import { ENCRYPT_URL } from '../constants/constant';
// eslint-disable-next-line import/namespace
import { findDefaultPage, updateEditor, getSingedUrl } from '../controllers/socketController';
import { Server } from 'socket.io';
import { EditorInterface } from '../interfaces/editorInterface';

dotenv.config();

const app = express();
app.get('/health_check', (req: Request, res: Response) => {
  res.send('health check success!!');
});
app.use(compression());
app.use(express.json());
app.use(methodOverride());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.post('/users/sign', getSingedUrl);

export const server = HTTPS.createServer(
  {
    ca: fs.readFileSync(ENCRYPT_URL.CA_URL),
    key: fs.readFileSync(path.resolve(process.cwd(), ENCRYPT_URL.KEY_URL), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), ENCRYPT_URL.CERT_URL), 'utf8').toString(),
  },
  app
);

const io = new Server(server, {});

io.on('connection', async (socket) => {
  const query = socket.handshake.query!;
  const defaultPage = await findDefaultPage(query.userId, query.pdfId);

  io.emit('updateEditorOnce', defaultPage, () => {
    socket.on('updateEditor', async (value: EditorInterface) => {
      await updateEditor(value);
    });
  });

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('user disconnected : ', socket.id, ' at ', new Date());
  });
});
