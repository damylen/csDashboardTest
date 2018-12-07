// with ES6 import
// with ES6 import
import * as io from 'socket.io-client';
// import state from './public/exampleState.json';
import { stringify } from 'querystring';
import * as fs from 'fs';

const state = require('./public/exampleState.json');
const socket = io.connect('http://localhost:3000');

const files = fs.readdirSync('out/');
let fileIndex = 0;

setInterval(() => {
  if (socket && socket.connected) {
    let result = fs.readFileSync('out/'  + files[fileIndex], 'utf8');
    if (result) {
      console.log("Read states from: out/" + files[fileIndex]);
      const states = JSON.parse(result);
      // state[0].states['power_consumption'] = Math.random() * 100;
      console.log('Send model state');
      socket.emit('model-state', states);
    }
    fileIndex+=1;
    fileIndex%=files.length;
  } else {
    console.log('Socket not connected. Not sending model state');
  }
}, 10000);

socket.on('connect', () => {
  console.log('Connected');
});
socket.on('event', data => {
  console.log(data);
});
socket.on('disconnect', () => {
  console.log('Disconnected');
});
console.log('Connecting');
