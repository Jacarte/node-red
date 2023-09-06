class IncomingMessage {
    constructor(socket) {
        this.socket = socket;
        console.log(socket);
        this._readableState = {};
    }


}

class ServerResponse {
    constructor() {
        this.headers = {};
        this.statusCode = 200;
    }
}

const target = { 

    // Get this from allowed
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'CONNECT', 'TRACE'],
    IncomingMessage,
    ServerResponse,
};


const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("FHTTP: Not implemented", prop);
            return null;
        }
    },
  };

module.exports = target;