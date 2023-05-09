// TODO This can be injected automatically by javy
let msg = Node.IO.msg();
let node = Node.IO.node();

const send = Node.IO.send;
const done = Node.IO.done;

RED._ = function(obj) {
    return obj;
}

// Make this a full project.
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

// Make this a full project.
function main() {
    var validate = false;
    let _this = {};

    if (msg.schema) {
        console.log(_this)
        // If input schema is different, re-compile it
        if (JSON.stringify(_this.schema) != JSON.stringify(msg.schema)) {
            try {
                _this.compiledSchema = ajv.compile(msg.schema);
                _this.schema = msg.schema;
            } catch(e) {
                _this.schema = null;
                _this.compiledSchema = null;
                // TODO check what this does
                console.log("json.errors.schema-error-compile")
                console.log(e.message)
                done(RED._("json.errors.schema-error-compile"));
                return;
            }
        }
        validate = true;
    }

    // Add getMessageProperty ? 
    console.log("It does find ajv");
    var value = RED.util.getMessageProperty(msg,node.property);

    if (value !== undefined) {
        if (typeof value === "string" || Buffer.isBuffer(value)) {
            // if (Buffer.isBuffer(value) && node.action !== "obj") {
            //     node.warn(RED._("json.errors.dropped")); done();
            // }
            // else
            if (node.action === "" || node.action === "obj") {
                try {
                    RED.util.setMessageProperty(msg,node.property,JSON.parse(value));
                    if (validate) {
                        if (_this.compiledSchema(msg[node.property])) {
                            delete msg.schema;
                            send(msg);
                            done();
                        } else {
                            msg.schemaError = _this.compiledSchema.errors;
                            done(`${RED._("json.errors.schema-error")}: ${ajv.errorsText(_this.compiledSchema.errors)}`);
                        }
                    } else  {
                        send(msg);
                        done();
                    }
                }
                catch(e) { done(e.message); }
            } else {
                // If node.action is str and value is str
                if (validate) {
                    if (_this.compiledSchema(JSON.parse(msg[node.property]))) {
                        delete msg.schema;
                        send(msg);
                        done();
                    } else {
                        msg.schemaError = _this.compiledSchema.errors;
                        done(`${RED._("json.errors.schema-error")}: ${ajv.errorsText(_this.compiledSchema.errors)}`);
                    }
                } else {
                    send(msg);
                    done();
                }
            }
        }
        else if ((typeof value === "object") || (typeof value === "boolean") || (typeof value === "number")) {
            if (node.action === "" || node.action === "str") {
                if (!Buffer.isBuffer(value)) {
                    try {
                        if (validate) {
                            if (_this.compiledSchema(value)) {
                                RED.util.setMessageProperty(msg,node.property,JSON.stringify(value,null,node.indent));
                                delete msg.schema;
                                send(msg);
                                done();
                            } else {
                                msg.schemaError = _this.compiledSchema.errors;
                                done(`${RED._("json.errors.schema-error")}: ${ajv.errorsText(_this.compiledSchema.errors)}`);
                            }
                        } else {
                            RED.util.setMessageProperty(msg,node.property,JSON.stringify(value,null,node.indent));
                            send(msg);
                            done();
                        }
                    }
                    catch(e) { done(RED._("json.errors.dropped-error")); }
                }
                else { node.warn(RED._("json.errors.dropped-object")); done(); }
            } else {
                // If node.action is obj and value is object
                if (validate) {
                    if (_this.compiledSchema(value)) {
                        delete msg.schema;
                        send(msg);
                        done();
                    } else {
                        msg.schemaError = _this.compiledSchema.errors;
                        done(`${RED._("json.errors.schema-error")}: ${ajv.errorsText(_this.compiledSchema.errors)}`);
                    }
                } else {
                    send(msg);
                    done();
                }
            }
        }
        else { node.warn(RED._("json.errors.dropped")); done(); }
    }
    else { send(msg); done(); } // If no property - just pass it on.

}

main()