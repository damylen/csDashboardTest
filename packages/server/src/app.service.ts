import { Injectable, Optional, Inject } from '@nestjs/common';
import { WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
@WebSocketGateway()
@Injectable()
export class AppService {

    @WebSocketServer() server;

    constructor(
    ) {
        console.log('Starting')
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    afterInit() {
        console.log(' After init ')
        console.log(this.server);
        setInterval(() => {
            if (this.server) {
                this.server.emit('seconds', { value: new Date().getSeconds() });
                this.server.emit('color', this.getRandomColor());
            }
        }, 1000);
    }

    @SubscribeMessage('events')
    onEvent(client, data: string): string {
        console.log('Got data');
        console.log(data);
        return data;
    }
}