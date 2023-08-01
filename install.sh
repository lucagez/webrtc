#!/bin/bash

set -e

apt update
apt install -y nodejs

npm install

echo "Starting server..."
node server.js

