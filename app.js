const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ExpressPeerServer = require('peer').ExpressPeerServer;
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}

const server = http.createServer(app).listen(PORT, function () {
  console.log(`Conclave is listening on port ${PORT}`);
});
https.createServer(sslOptions, app).listen(443);

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  const address = req.protocol + '://' + req.get('host');
  const host = req.get('host').split(':')[0];
  const id = req.query.id ? req.query.id : 0;
  res.render('index', { id: id, host: host, address: address });
});

app.use('/peerjs', ExpressPeerServer(server, {debug:true}));
