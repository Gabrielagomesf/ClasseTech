#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const host = process.argv[2] || getLanIp();
const port = Number(process.argv[3] || 3333);
const target = path.join(__dirname, '..', 'src', 'config', 'api.local.json');

fs.writeFileSync(target, JSON.stringify({host, port}, null, 2) + '\n');
console.log(`API host configurado: http://${host}:${port}/api`);
console.log(`Arquivo: ${target}`);
