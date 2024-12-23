"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WssService = void 0;
const ws_1 = require("ws");
//aqui se colocora las notificaciones de webhook
class WssService {
    constructor(options) {
        const { server, path = '/ws' } = options;
        this.wss = new ws_1.WebSocketServer({ server, path });
        this.start();
    }
    static get instance() {
        if (!WssService._instance) {
            throw 'WssService is not initialized';
        }
        return WssService._instance;
    }
    static initWss(options) {
        WssService._instance = new WssService(options);
    }
    sendMessage(type, payload) {
        //aqui se manda a todos los clientes incluso uno
        //se debera configurar para que solo mande a un cliente con identificador especifico
        this.wss.clients.forEach(client => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify({ type, payload }));
            }
        });
    }
    start() {
        this.wss.on('connection', (ws) => {
            //const prismaService = new PrismaService();
            //aqui van las notificaciones de websocket
            //Aquí agregamos el manejador de eventos para el evento 'message'
            ws.on('message', (message) => {
                const messageString = message.toString('utf8');
                console.log('mensaje recibido:', messageString);
                try {
                    // const data = JSON.parse(message);
                    //Aquí puedes manejar el objeto JSON recibido
                    //console.log(`mensaje recibido:${data}`, );
                    this.sendMessage('broadcast', messageString);
                    // prismaService.onMessageReceived(data);
                }
                catch (error) {
                    console.error('Invalid JSON received:', messageString);
                }
            });
            console.log('cliente conectado');
            ws.on('close', () => console.log('Client disconnected'));
        });
    }
}
exports.WssService = WssService;
