// websocket.js
export default class WebSocketService {
    constructor(convoId, userToken) {
        this.ws = null;
        this.convoId = convoId;
        this.userToken = userToken;
        this.url = `ws://api.tabakoptrf.ru/ws/chat/${this.convoId}/?token=${this.userToken}`;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log("WebSocket Connected");
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("New message:", message);

        };

        this.ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setTimeout(() => this.connect(), 3000); // Auto-reconnect
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}