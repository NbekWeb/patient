export default class WebSocketService {
    constructor(convoId, userToken, onMessageCallback) {
        this.ws = null;
        this.convoId = convoId;
        this.userToken = userToken;
        this.url = `wss://api.tabakoptrf.ru/ws/chat/${this.convoId}/?token=${this.userToken}`;
        this.onMessageCallback = onMessageCallback; // Store the callback
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {};

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (this.onMessageCallback) {
                this.onMessageCallback(message); // Call the callback with the new message
            }
        };

        this.ws.onclose = () => {
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