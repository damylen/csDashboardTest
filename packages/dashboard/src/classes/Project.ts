import { AppState } from '@csnext/cs-client';
import { IDatasource, IDashboard } from '@csnext/cs-core';
import io from 'socket.io-client';

export class Project implements IDatasource {

  public socket! : SocketIOClient.Socket;

  public seconds: number = 0;
  public color = "white";
  public buttonCount: number = 0;
  public chart = {
    type: "gauge",
    columns: [
      ["data1", 30]
    ]
  }

  init() {
    console.log('Init project');

    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('Connected');
      this.socket.emit('events', { test: 'test' });
      AppState.Instance.TriggerNotification({ title: 'Connected' });
    });
    this.socket.on('seconds', (data: any) => {
      this.seconds = data.value;
    });

    this.socket.on('color', (color: string) => {
      this.color = color;
    });

    this.socket.on('buttonCount', (value: number) => {
      this.buttonCount = value;
    });
    this.socket.on('exception', (data: any) => {
      console.log('event', data);
    });
    this.socket.on('disconnect', (data: any) => {
      console.log('Disconnected');
      AppState.Instance.TriggerNotification({ title: 'Disconnected' });
    });


    AppState.Instance.bus.subscribe(
      'dashboards',
      () => {
        // console.log(a);
      }
    );


  }


  public id = 'project-datasource';

  public execute(): Promise<any> {

    this.init();
    return new Promise((resolve, reject) => {
      resolve(this);
    });
  }

}
