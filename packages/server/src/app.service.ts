import { Injectable, Optional, Inject } from '@nestjs/common';
import { WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Client } from 'socket.io'
@WebSocketGateway()
@Injectable()
export class AppService {

    public static buttonCount = 0;

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

    handleConnection(d: Client) {
        this.server.emit('buttonCount',AppService.buttonCount);
        console.log('Connection');
    }

    afterInit() {
        console.log(' After init ')
        setInterval(() => {
            if (this.server) {
                this.server.emit('seconds', { value: new Date().getSeconds() });
                this.server.emit('color', this.getRandomColor());
            }
        }, 1000);
    }

    @SubscribeMessage('model-state')
    onModelState(client: Client, data: string) {
        console.log('Got model state');
        this.server.emit('model-state',data);        
    }

    @SubscribeMessage('button')
    onButton(client : Client, data: string) {
        console.log('Button clicked');
        AppService.buttonCount++;
        this.server.emit('buttonCount', AppService.buttonCount);
        console.log(client.id);
    }

    @SubscribeMessage('slider')
    onSlider(client, data: string) {

        console.log('Slider changed');
        console.log(data);
    }

    @SubscribeMessage('events')
    onEvent(client, data: string) {
        console.log('Got data');
        console.log(data);
      
    }
}