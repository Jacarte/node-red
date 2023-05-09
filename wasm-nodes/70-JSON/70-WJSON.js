
// Use import instead
const WASI = require('wasi');
//console.log(WASI.WASI);
const fs = require('fs');

module.exports = function(RED) {

    function WJSONNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', async function(msg,send,done) {
            
            const wasi = new WASI.WASI({
                version: 'preview1',
                args: [ /* empty for now */ ],
                env: { /* empty for now */ },
                preopens: {
                  // '/sandbox': '/dev/',
                },
              });
    
              // TODO this can be just...download from OCI
              const wasm = await WebAssembly.compile(
                fs.readFileSync(`${__dirname}/70.wasm`),
              );
              
              const instance = await WebAssembly.instantiate(wasm, {
                ...wasi.getImportObject(),
                "env": {
                  "node_red_msg_size": function() {
                     // Return the size in bytes of the message encoded as a JSON string 
                     let json = JSON.stringify(msg);
                     let buffer = new TextEncoder().encode(json);
                     //console.log("Sending data", buffer.byteLength);
                     return buffer.byteLength;
                  },
                  "node_red_node_size": function() {
                    // Return the size in bytes of the message encoded as a JSON string 
                    let json = JSON.stringify(node);
                    let buffer = new TextEncoder().encode(json);
                    //console.log("Sending data", buffer.byteLength);
                    return buffer.byteLength;
                 },
                  "node_red_msg": function(data, offset, length){
                    let json = JSON.stringify(msg);
                    //console.log("Sending data", data, offset, length);
                    let buffer = new TextEncoder().encode(json);
                    let bytes = new Uint8Array(instance.exports.memory.buffer, data + offset, length);
                    bytes.set(buffer);
                    return buffer.byteLength;
                  },
                  "node_red_node": function(data, offset, length){
                    let json = JSON.stringify(node);
                    //console.log("Sending data", data, offset, length);
                    let buffer = new TextEncoder().encode(json);
                    let bytes = new Uint8Array(instance.exports.memory.buffer, data + offset, length);
                    bytes.set(buffer);
                    return buffer.byteLength;
                  },
                  "node_red_send": function(data, offset, length){
                    //console.log("Sending data", data, offset, length);
                    let d =  instance.exports.memory.buffer.slice(data + offset, data + offset + length);
                    let buffer = new Uint8Array(d);
                    let encoded = new TextDecoder().decode(buffer);
                    // The message is changed here
                    msg = JSON.parse(encoded);
                    send(msg)
                  },
                  "node_red_done": function(data, offset, length){
                    //console.log("Done data", data, offset, length);
                    let d =  instance.exports.memory.buffer.slice(data + offset, data + offset + length);
                    let buffer = new Uint8Array(d);
                    let encoded = new TextDecoder().decode(buffer);
                    // The message is changed here
                    if(encoded){
                        msg = JSON.parse(encoded);
                        done(msg)
                    }
                    else 
                    {
                      done()
                    }
                  }
                }
              });
    
              // call the instance start function
              wasi.start(instance);

        });
    }
    RED.nodes.registerType("wjson",WJSONNode);
}
