// const domainName = 'junglenewcumbersocket.shop'; // TODO : 구매한 도메인을 기재한다.
const domainName = 'tradingstudy.shop';

export const ENCRYPT_URL = {
  CA_URL: `/etc/letsencrypt/live/${domainName}/fullchain.pem`,
  KEY_URL: `/etc/letsencrypt/live/${domainName}/privkey.pem`,
  CERT_URL: `/etc/letsencrypt/live/${domainName}/cert.pem`,
};
