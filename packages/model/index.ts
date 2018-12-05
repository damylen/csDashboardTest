// with ES6 import
// with ES6 import
import * as io from 'socket.io-client';
// import state from './public/exampleState.json';
import { InfluxDB } from 'influx';

const state = require('./public/exampleState.json');
let newState = [];

const socket = io.connect('http://localhost:3000');

function initInflux() { 

  const db = new InfluxDB('http://user:password@server:8086/database');
  db.getMeasurements('database')
    .then(result => {
      for (const measurement of result) {
        console.log(measurement);
      }
    })
    .catch(reason => {
      console.log(reason);
    });

  db.query(
    `
    select * from response_times    
    order by time desc
    limit 10
  `
  )
    .then(result => {
      for (const line of result) {
        newState.push({
          "name": ""
        });
        console.log(line);        
      }
      // res.json(result);
    })
    .catch(err => {
      // res.status(500).send(err.stack);
    });
}

initInflux();

setInterval(() => {
  console.log('Send model state');
  if (socket && socket.connected) {
    state[0].states['power_consumption'] = Math.random() * 100;
    socket.emit('model-state', newState);
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
