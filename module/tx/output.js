"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rsaConfig = require("../../rsa.json");
class Output {
    get $index() {
        return this.index;
    }
    set $index(value) {
        this.index = value;
    }
    get $txId() {
        return this.txId;
    }
    set $txId(value) {
        this.txId = value;
    }
    get $value() {
        return this.value;
    }
    set $value(value) {
        this.value = value;
    }
    /* public get $lockScript(): string {
        return this.lockScript;
    }

    public set $lockScript(value: string) {
        this.lockScript = value;
    } */
    constructor(value, publicKey) {
        this.value = value;
        this.lockScript = publicKey;
    }
    // 反序列化，进行类型转换
    static createOnputsFromUnserialize(objs) {
        let outs = [];
        objs.forEach((obj) => {
            outs.push(new Output(obj.value, obj.lockScript));
        });
        return outs;
    }
    canUnlock(privateKey) {
        if (privateKey == rsaConfig[this.lockScript]) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Output = Output;
//# sourceMappingURL=output.js.map