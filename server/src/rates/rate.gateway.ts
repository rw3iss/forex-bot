import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { RateService } from './rate.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class RateGateway implements OnGatewayConnection, OnGatewayDisconnect {


    constructor(private rateService: RateService){
    }

    afterInit(server: Server) {
      this.rateService.socket = server;
    }

    async handleConnection(client: any) {
        console.log("Websocket client connected...");
        this.rateService.clients.push(client);
        this.rateService.socket.emit('users', this.rateService.clients.length);
    }

    handleDisconnect(client) {
        for (let i = 0; i < this.rateService.clients.length; i++) {
            if (this.rateService.clients[i] === client) {
                this.rateService.clients.splice(i, 1);
                break;
            }
        }
        this.rateService.socket.emit('users', this.rateService.clients.length);
    }

    @SubscribeMessage('rate')
    async onRate(client, message) {
        client.broadcast.emit('rate', message);
    }

}