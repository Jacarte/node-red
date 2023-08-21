
// Mock process as a proxy
const processO = {
    hrtime(){
        return __date_clock();
    }
 };

const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("process: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(processO, handler1);

module.exports = proxy1;
