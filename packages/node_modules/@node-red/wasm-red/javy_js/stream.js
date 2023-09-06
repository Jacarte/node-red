const target = {};


const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return target[prop]
        }
        return () => {
            console.log("stream: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(target, handler1);


module.exports = proxy1;