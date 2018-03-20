"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const transaction_1 = require("./tx/transaction");
/**
 *  区块信息：
 *  区块大小：用字节表示的区块数据大小
    区块头：组成区块头的几个字段
        区块头hash值
        父区块头hash值
        时间戳：区块产生的近似时间
        Merkle根：该区块中交易的merkle树根的哈希值
        难度目标：该区块工作量证明算法的难度目标
        Nonce：用于工作量证明算法的计数器
    交易计数器：交易的数量
    交易：记录在区块里的交易信息
 */
class Block {
    constructor(size, hash, prevHash, timestamp, factor, nonce = 0, txs) {
        this.blockSize = 0;
        this.blockSize = size;
        this.hash = hash;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.diffcult_factor = factor;
        this.nonce = nonce;
        this.txs = transaction_1.Transaction.createTransactionFromUnserialize(txs);
        this.ack_num = 0;
    }
    get $hash() {
        return this.hash;
    }
    set $hash(value) {
        this.hash = value;
    }
    get $prevHash() {
        return this.prevHash;
    }
    set $prevHash(value) {
        this.prevHash = value;
    }
    get $blockSize() {
        return this.blockSize;
    }
    set $blockSize(value) {
        this.blockSize = value;
    }
    get $nonce() {
        return this.nonce;
    }
    set $nonce(value) {
        this.nonce = value;
    }
    get $minner() {
        return this.minner;
    }
    set $minner(value) {
        this.minner = value;
    }
    get $height() {
        return this.height;
    }
    set $height(value) {
        this.height = value;
    }
    get $diffcult_factor() {
        return this.diffcult_factor;
    }
    set $diffcult_factor(value) {
        this.diffcult_factor = value;
    }
    get $ack_num() {
        return this.ack_num;
    }
    set $ack_num(value) {
        this.ack_num = value;
    }
    get $timestamp() {
        return this.timestamp;
    }
    set $timestamp(value) {
        this.timestamp = value;
    }
    get $txs() {
        return this.txs;
    }
    set $txs(value) {
        this.txs = value;
    }
    createBlock(prevHash, factor, data) {
        return new Block(0, '', prevHash, Date.now(), factor, 0, data);
    }
    setBlockSize() {
        this.txs && this.txs.forEach((tx) => {
            this.blockSize += tx.getLength();
        });
    }
    computeHash() {
        let txids = '';
        this.txs && this.txs.forEach((tx) => {
            txids += tx.$txId;
        });
        let sha256 = crypto.createHash('sha256');
        sha256.update(`${this.prevHash}${this.nonce.toString(16)}${txids}`, 'utf8');
        let hash = sha256.digest('hex');
        //    this.$hash = hash;
        return hash;
    }
}
exports.Block = Block;
//# sourceMappingURL=block.js.map