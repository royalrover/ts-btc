"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
const output_1 = require("./output");
const buffer_1 = require("buffer");
const crypto = require("crypto");
const blockchain_1 = require("../blockchain");
const BlockDao_1 = require("../../dao/BlockDao");
const block_1 = require("../block");
const AWARD = 12.5;
let chain;
class Transaction {
    constructor(txId, inputs, outputs) {
        this.txId = txId;
        this.inputTxs = inputs;
        this.outputTxs = outputs;
    }
    get $txId() {
        return this.txId;
    }
    set $txId(value) {
        this.txId = value;
    }
    get $inputTxs() {
        return this.inputTxs;
    }
    set $inputTxs(value) {
        this.inputTxs = value;
    }
    get $outputTxs() {
        return this.outputTxs;
    }
    set $outputTxs(value) {
        this.outputTxs = value;
    }
    // 反序列化，进行类型转换
    static createTransactionFromUnserialize(objs) {
        let txs = [];
        objs.forEach((obj) => {
            txs.push(new Transaction(obj.txId, input_1.Input.createInputsFromUnserialize(obj.inputTxs), output_1.Output.createOnputsFromUnserialize(obj.outputTxs)));
        });
        return txs;
    }
    getLength() {
        let len = 0;
        if (this.txId) {
            len += buffer_1.Buffer.byteLength(this.txId);
        }
        if (this.inputTxs.length) {
            this.inputTxs.forEach((input) => {
                len += buffer_1.Buffer.byteLength(input.$txId + input.$outputIndex);
            });
        }
        if (this.outputTxs.length) {
            this.outputTxs.forEach((output) => {
                len += buffer_1.Buffer.byteLength(output.$value + '');
            });
        }
        return len;
    }
    /*
        1.交易结构各字段序列化为字节数组
        2.把字节数组拼接为支付串
        3.对支付串计算两次SHA256 得到交易hash
    */
    setTxId() {
        let sha256 = crypto.createHash('sha256');
        sha256.update(JSON.stringify(this.inputTxs) + JSON.stringify(this.outputTxs) + Date.now(), 'utf8');
        this.txId = sha256.digest('hex');
    }
    // coinbase交易用于给矿工奖励，input为空，output为矿工报酬
    static createCoinbaseTx(pubKey, info) {
        let input = new input_1.Input('', -1, info);
        let output = new output_1.Output(AWARD, pubKey);
        let tx = new Transaction('', [input], [output]);
        tx.setTxId();
        return tx;
    }
    static isCoinbaseTx(tx) {
        if (tx.$inputTxs.length == 1 && tx.$inputTxs[0].$outputIndex == -1 && tx.$inputTxs[0].$txId == '') {
            return true;
        }
        else {
            return false;
        }
    }
    // 创建转账交易
    static createTransaction(from, fromPubkey, fromKey, to, toPubkey, coin) {
        let outputs = this.findUTXOToTransfer(fromKey, coin);
        console.log(`UTXOToTransfer： ${JSON.stringify(outputs)}, from: ${from} to ${to} transfer ${coin}`);
        let inputTx = [], sum = 0, outputTx = [];
        outputs.forEach((o) => {
            sum += o.$value;
            inputTx.push(new input_1.Input(o.$txId, o.$index, fromKey));
        });
        if (sum < coin) {
            throw Error(`余额不足，转账失败! from ${from} to ${to} transfer ${coin}btc, but only have ${sum}btc`);
        }
        // 公钥锁住脚本
        outputTx.push(new output_1.Output(coin, toPubkey));
        if (sum > coin) {
            outputTx.push(new output_1.Output(sum - coin, fromPubkey));
        }
        let tx = new Transaction('', inputTx, outputTx);
        tx.setTxId();
        return tx;
    }
    // 获取某用户的所有已花费的output
    static getAllSpentOutput(secreteKey) {
        // outputHash键为txid，值为outputIndex
        let outputIndexHash = {};
        chain = blockchain_1.BlockChain.createBlockChain();
        let block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(chain.$lastACKHash);
        while (block && block instanceof block_1.Block) {
            block.$txs && block.$txs.forEach((tx) => {
                if (Transaction.isCoinbaseTx(tx)) {
                    /*     if(tx.$inputTxs[0].canUnlock(secreteKey)){
                            outputIndexHash[tx.$txId] = 0;
                        } */
                    return;
                }
                tx.$inputTxs && tx.$inputTxs.forEach((input, i) => {
                    if (input.canUnlock(secreteKey)) {
                        outputIndexHash[input.$txId] = input.$outputIndex;
                    }
                });
            });
            block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
        return outputIndexHash;
    }
    static getAllUnspentOutputTx(secreteKey) {
        let outputIndexHash = this.getAllSpentOutput(secreteKey);
        //    console.log('outputIndexHash ',outputIndexHash)
        let unspentOutputsTx = [];
        let keys = Object.keys(outputIndexHash);
        let block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(chain.$lastACKHash);
        while (block && block instanceof block_1.Block) {
            block.$txs && block.$txs.forEach((tx) => {
                /* if(keys.includes(tx.$txId)){
                    console.log('-->'+tx.$txId,JSON.stringify(tx.$outputTxs))
                    tx.$outputTxs.forEach((output,i)=>{
                        // 过滤已消费的output
                        if(i == outputIndexHash[tx.$txId])
                            return;
                        
                        if(output.canUnlock(secreteKey)){
                            output.$txId = tx.$txId;
                            output.$index = i;
                            unspentOutputs.push(output);
                        }
                    });
                }else
                // 如果是coinbase
                if(Transaction.isCoinbaseTx(tx)){
                    if(tx.$inputTxs[0].canUnlock(secreteKey)){
                        tx.$outputTxs[0].$txId = tx.$txId;
                        tx.$outputTxs[0].$index = 0;
                        unspentOutputs.push(tx.$outputTxs[0]);
                    }
                    return;
                }// 如果没有找到该用户的input，说明该用户并没有进行转账，因此遍历所有的tx寻找他的utxo
                else if(!keys.length){
                    tx.$outputTxs.forEach((output,i)=>{
                        if(output.canUnlock(secreteKey)){
                            output.$txId = tx.$txId;
                            output.$index = i;
                            unspentOutputs.push(output);
                        }
                    });
                } */
                if (keys.includes(tx.$txId)) {
                    //    console.log('-->'+tx.$txId,JSON.stringify(tx.$outputTxs))
                    tx.$outputTxs.forEach((output, i) => {
                        // 过滤已消费的output
                        if (i == outputIndexHash[tx.$txId])
                            return;
                        if (output.canUnlock(secreteKey)) {
                            unspentOutputsTx.push(tx);
                        }
                    });
                }
                else {
                    for (let i = 0, len = tx.$outputTxs.length; i < len; i++) {
                        let output = tx.$outputTxs[i];
                        if (output.canUnlock(secreteKey)) {
                            unspentOutputsTx.push(tx);
                            break;
                        }
                    }
                }
            });
            block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
        return unspentOutputsTx;
    }
    static findUTXOToTransfer(secreteKey, transferCoin) {
        let unspentOutputsTx = this.getAllUnspentOutputTx(secreteKey);
        //    console.log('unspentOutputsTx ',unspentOutputsTx)
        let UTXOSort = function (keyName) {
            return function (objectN, objectM) {
                var valueN = objectN[keyName];
                var valueM = objectM[keyName];
                if (valueN < valueM)
                    return -1;
                else if (valueN > valueM)
                    return 1;
                else
                    return 0;
            };
        };
        let outputs = [], utxos = [], sum = 0;
        unspentOutputsTx.forEach((tx) => {
            tx.$outputTxs && tx.$outputTxs.forEach((out, i) => {
                if (out.canUnlock(secreteKey)) {
                    out.$txId = tx.$txId;
                    out.$index = i;
                    outputs.push(out);
                }
            });
        });
        outputs = outputs.sort(UTXOSort('value'));
        outputs.forEach((utxo) => {
            if (sum < transferCoin) {
                utxos.push(utxo);
            }
            sum += utxo.$value;
        });
        return utxos;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map