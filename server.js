const fs = require('fs');
const os = require('os');
const https = require('https');
const privateKey  = fs.readFileSync('domain.key', 'utf8');
const certificate = fs.readFileSync('domain.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

const addresses = []
const networkInterfaces = os.networkInterfaces();

for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    // Skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      addresses.push(net.address);
    }
  }
}

app.get("/peerjs.min.js", (_, res) => res.sendFile(__dirname + "/peerjs.min.js"));
app.get("/script.js", (_, res) => res.sendFile(__dirname + "/script.js"));
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));

const server = https.createServer(credentials, app);
const peerServer = ExpressPeerServer(server, {
  path: "/call",
});

app.use("/peerjs", peerServer);

console.log("Starting webrtc server 🦄");
for (const address of addresses) {
  console.log(`https://${address}:9443/`);
}
server.listen(9443, '0.0.0.0');
