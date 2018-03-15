"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
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
var Block = /** @class */ (function () {
    function Block(size, hash, prevHash, timestamp, factor, nonce, data) {
        if (nonce === void 0) { nonce = 0; }
        this.blockSize = size;
        this.hash = hash;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.diffcult_factor = factor;
        this.nonce = nonce;
        this.deal_data = data;
        this.ack_num = 0;
    }
    Object.defineProperty(Block.prototype, "$hash", {
        get: function () {
            return this.hash;
        },
        set: function (value) {
            this.hash = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$prevHash", {
        get: function () {
            return this.prevHash;
        },
        set: function (value) {
            this.prevHash = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$blockSize", {
        get: function () {
            return this.blockSize;
        },
        set: function (value) {
            this.blockSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$nonce", {
        get: function () {
            return this.nonce;
        },
        set: function (value) {
            this.nonce = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$minner", {
        get: function () {
            return this.minner;
        },
        set: function (value) {
            this.minner = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$height", {
        get: function () {
            return this.height;
        },
        set: function (value) {
            this.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$diffcult_factor", {
        get: function () {
            return this.diffcult_factor;
        },
        set: function (value) {
            this.diffcult_factor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$deal_data", {
        get: function () {
            return this.deal_data;
        },
        set: function (value) {
            this.deal_data = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$ack_num", {
        get: function () {
            return this.ack_num;
        },
        set: function (value) {
            this.ack_num = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "$timestamp", {
        get: function () {
            return this.timestamp;
        },
        set: function (value) {
            this.timestamp = value;
        },
        enumerable: true,
        configurable: true
    });
    Block.prototype.createBlock = function (prevHash, factor, data) {
        return new Block(0, '', prevHash, Date.now(), factor, 0, data);
    };
    Block.prototype.computeHash = function () {
        var sha256 = crypto.createHash('sha256');
        sha256.update("" + this.prevHash + this.nonce.toString(16) + this.deal_data, 'utf8');
        var hash = sha256.digest('hex');
        //    this.$hash = hash;
        return hash;
    };
    return Block;
}());
exports.Block = Block;
//# sourceMappingURL=block.js.map