import { InfluxDB, Measurement } from 'influx';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

const startRecording = '2017-08-30T07:30:00.000Z'
const endRecording = '2017-08-30T09:30:00.000Z'
const timeStepLength = '15m'

function initInflux() {
  
  return new InfluxDB('http://monitoring:8086/hesi_demo');


}

function getMeasurements(db): Promise<Map<string, Array<{}>>> {
  let stampedStates: Map<string, Array<{}>> = new Map();
  return new Promise((resolve, reject) => {
    db.getMeasurements('hesi_demo')
      .then(async result => {
        for (const measurement of result) {
          console.log(measurement);
          let mac = measurement.split('_').pop();
          if (mac.split(':').length == 6) {
            let states = new Map();
            if (measurement.startsWith('State_battery_driver')) {
              states = await createBatteryStates(measurement, db);
            } else if (measurement.startsWith('State_pvt_driver')) {
              states = await createPVTStates(measurement, db);
            } else if (measurement.startsWith('State_load_driver')) {
              states = await createBaseLoadStates(measurement, db);
            }
            for (let ts of Array.from(states.entries())) {
              let state_array = [];
              if (!stampedStates.has(ts[0])) {
                //add new timestep element:
                console.log('constains no timestep');
                state_array.push(ts[1]);
              } else {
                console.log('constains timestep');
                // push to existing element:
                state_array = stampedStates.get(ts[0]);
                state_array.push(ts[1]);
              }
              stampedStates.set(ts[0], state_array);
            }

          }
        }
        resolve(stampedStates);
      })
      .catch(reason => {
        console.log(reason);
        reject("Error");
      });
  });
}

function createBatteryStates(measurement, db): Promise<Map<string, {}>> {
  return new Promise((resolve, reject) => {
    let device_uuid: string = uuid();
    let query = `SELECT mean("current_power") as power, mean("state_of_charge") as soc \
  FROM "` + measurement + `" \
  WHERE time > '` + startRecording + `' AND time < '` + endRecording + `' \
  GROUP BY time(` + timeStepLength + `)`;
    let states = new Map();
    console.log(query);
    db.query(
      query
    ).then(result => {
      for (const line of result) {
        states.set(line['time']['_nanoISO'], {
          "name": measurement,
          "id": device_uuid,
          "type": "battery",
          "states": {
            "power_consumption": line['power'],
            "soc": line['soc'] * 100
          },
          "actions": {
            "turnoff": {
              "enabled": false
            },
            "turnon": {
              "title": "Turn On",
              "enabled": true
            }
          }
        });
      }
      resolve(states);
    }
    ).catch(err => {
      console.log(err.stack);
      reject(' error ')
    });
  })
}

function createPVTStates(measurement, db): Promise<Map<string, {}>> {
  return new Promise((resolve, reject) => {

    let device_uuid: string = uuid();
    let query = `SELECT mean("electric_power") as power \
  FROM "` + measurement + `" \
  WHERE time > '` + startRecording + `' AND time < '` + endRecording + `' \
  GROUP BY time(` + timeStepLength + `)`;
    let states = new Map();
    console.log(query);
    db.query(
      query
    ).then(result => {
      for (const line of result) {
        states.set(line['time']['_nanoISO'], {
          "name": measurement,
          "id": device_uuid,
          "type": "pvt",
          "states": {
            "power_consumption": line['power'],
          }
        });
      }
      resolve(states);
    }
    ).catch(err => {
      console.log(err.stack);
      reject(' error ')
    });
  })
}

function createBaseLoadStates(measurement, db): Promise<Map<string, {}>> {
  return new Promise((resolve, reject) => {

    let device_uuid: string = uuid();
    let query = `SELECT mean("electric_power") as power \
  FROM "` + measurement + `" \
  WHERE time > '` + startRecording + `' AND time < '` + endRecording + `' \
  GROUP BY time(` + timeStepLength + `)`;
    let states = new Map();
    console.log(query);
    db.query(
      query
    ).then(result => {
      for (const line of result) {
        states.set(line['time']['_nanoISO'], {
          "name": measurement,
          "id": device_uuid,
          "type": "baseload",
          "states": {
            "power_consumption": line['power'],
          }
        });
      }
      resolve(states);
    }
    ).catch(err => {
      console.log(err.stack);
      reject(' error ')
    });
  })
}

getMeasurements(initInflux()).then(result => {
  // console.log(result);
  console.log("Writing to file");
  for (let ts of Array.from(result.entries())) {
    console.log("Writing " + ts[0] + "to file");
    fs.writeFileSync("out/" + ts[0] + ".json", JSON.stringify(ts[1], null, 2));
  }
});

