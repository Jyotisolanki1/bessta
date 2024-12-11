const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: false });
const handle = app.getRequestHandler();

/**
 * SSL_KEY_FILE and SSL_CRT_FILE are ...
 */
const privateKeyPath = '/etc/letsencrypt/live/indoredev.webmobrildemo.com/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/indoredev.webmobrildemo.com/cert.pem';
const caPath = '/etc/letsencrypt/live/indoredev.webmobrildemo.com/fullchain.pem';

const port = 10015;

const httpsOptions = {
  key: fs.readFileSync(privateKeyPath),
  cert: fs.readFileSync(certificatePath),
  ca: [fs.readFileSync(caPath)]
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server started on https://localhost:${port}`);
  });
});
