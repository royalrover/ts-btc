"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Input {
    get $txId() {
        return this.txId;
    }
    set $txId(value) {
        this.txId = value;
    }
    get $outputIndex() {
        return this.outputIndex;
    }
    set $outputIndex(value) {
        this.outputIndex = value;
    }
    get $unlockScript() {
        return this.unlockScript;
    }
    set $unlockScript(value) {
        this.unlockScript = value;
    }
    constructor(txId, index, unlockScript) {
        this.txId = txId;
        this.outputIndex = index;
        this.unlockScript = unlockScript;
    }
    // 反序列化，进行类型转换
    static createInputsFromUnserialize(objs) {
        let ins = [];
        objs.forEach((obj) => {
            ins.push(new Input(obj.txId, obj.outputIndex, obj.unlockScript));
        });
        return ins;
    }
    canUnlock(privateKey) {
        if (privateKey == this.unlockScript) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Input = Input;
//# sourceMappingURL=input.js.map