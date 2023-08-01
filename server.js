const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('domain.key', 'utf8');
const certificate = fs.readFileSync('domain.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

app.get("/peerjs.min.js", (_, res) => res.sendFile(__dirname + "/peerjs.min.js"));
app.get("/script.js", (_, res) => res.sendFile(__dirname + "/script.js"));
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));

const server = https.createServer(credentials, app);
const peerServer = ExpressPeerServer(server, {
  path: "/call",
});

app.use("/peerjs", peerServer);

server.listen(9443, '0.0.0.0');
