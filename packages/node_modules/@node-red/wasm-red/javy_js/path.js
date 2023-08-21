// Implement a proxy here, it will be better
// TODO replace by a Javy wrapper, it will be better for the file node :)

const target = { 
    isAbsolute(path){
        return path.startsWith("/");
    },
    join(...args){
        return args.join("/");
    },
    dirname(path){
        return path.split("/").slice(0,-1).join("/");
    },
    resolve(...args){
        return args.join("/");
    }
};
const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("path: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(target, handler1);

module.exports = proxy1;