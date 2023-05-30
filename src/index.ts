import { server } from './routes/socketRoute';

const sslport = 443;

server.listen(sslport, () => {
  // eslint-disable-next-line no-console
  console.log('[HTTPS] Server is started on port 443');
});
