// Implement a proxy here, it will be better

const target = {
    EOL:"\0",
    userInfo(){
        return {
            username: "Javy wrapper",
        }
    }
 };
const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("os: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(target, handler1);

module.exports = target;