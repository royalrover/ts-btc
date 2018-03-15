"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var block_1 = require("./block");
var ProofOfWork_1 = require("./ProofOfWork");
var config = require("../pow.config.json");
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [];
    }
    BlockChain.prototype.addGenisisBlock = function (block) {
        this.chain.push(block);
    };
    BlockChain.prototype.addBlock = function (block) {
        var pow = new ProofOfWork_1.ProofOfWork(Number(config.factor), block);
        var result = pow.mineGold();
        if (result instanceof Error) {
            return console.error('fatal error, system down during mining!');
        }
        if (pow.verify(result)) {
            console.log('block块被验证通过');
            block.$ack_num += 1;
            block.$height = this.chain.length - 1;
            block.$timestamp = Date.now();
            this.chain.push(block);
        }
        else {
            console.warn("block\u9A8C\u8BC1\u51FA\u9519\uFF0C\u5F53\u524Dblock info:\n " + JSON.stringify(block) + "  \u76EE\u6807\u4E3A " + pow.$goal.toString(16));
        }
    };
    BlockChain.prototype.addBlockToConsensus = function (data) {
        console.log('添加需要运算的block');
        var block = new block_1.Block(Buffer.byteLength(data), '', this.chain[this.chain.length - 1].$hash, Date.now(), 0, 0, data);
        this.addBlock(block);
        console.log('*********************************************');
    };
    BlockChain.prototype.addBlockWithMeta = function (data, nonce, factor) {
        if (factor === void 0) { factor = 0; }
        var block = new block_1.Block(Buffer.byteLength(data), '', this.chain[this.chain.length - 1].$hash, Date.now(), factor, nonce, data);
        block.computeHash();
        this.chain.push(block);
    };
    BlockChain.prototype.createGenesisBlock = function () {
        var data = 'Genesis block, start the world...';
        var Gblock = new block_1.Block((Buffer.byteLength(data)), '', '', Date.now(), 0, 0, data);
        var hash = Gblock.computeHash();
        Gblock.$hash = hash;
        return Gblock;
    };
    BlockChain.initBlockchain = function () {
        var blockChain = new BlockChain();
        var Gblock = blockChain.createGenesisBlock();
        blockChain.addGenisisBlock(Gblock);
        return blockChain;
    };
    BlockChain.prototype.printChain = function () {
        this.chain.forEach(function (block) {
            console.log('----------------------------------------');
            console.log("current block hash: " + block.$hash);
            console.log("prev hash: " + block.$prevHash);
            console.log("current nonce: " + block.$nonce);
            console.log("current block info: " + block.$deal_data);
            console.log("current block vefiry number: " + block.$ack_num);
            console.log("time: " + moment(new Date(block.$timestamp)).format('YYYY-MM-DD HH:mm:ss'));
        });
    };
    return BlockChain;
}());
exports.BlockChain = BlockChain;
//# sourceMappingURL=blockchain.js.map