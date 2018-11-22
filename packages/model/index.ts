
// with ES6 import
// with ES6 import
import * as io from 'socket.io-client';
// import state from './public/exampleState.json';

const state = require('./public/exampleState.json');

const socket = io.connect('http://localhost:3000');

setInterval(() => {
  console.log('Send model state')
  if (socket && socket.connected) {
      state[0].states['power_consumption'] = Math.random() * 100;
      socket.emit('model-state', state);      
  }
}, 1000);


socket.on('connect', () => {
  console.log('Connected');
});
socket.on('event', (data) => { console.log(data); });
socket.on('disconnect', () => { console.log('Disconnected')});
console.log('Connecting');