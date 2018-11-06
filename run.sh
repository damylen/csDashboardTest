#!/bin/sh

node ./server/index.js &
http-server ./client
