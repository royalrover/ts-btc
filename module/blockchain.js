"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const block_1 = require("./block");
const ProofOfWork_1 = require("./ProofOfWork");
const config = require("../pow.config.json");
const BlockDao_1 = require("../dao/BlockDao");
const LatestHashDao_1 = require("../dao/LatestHashDao");
const ChainHeightDao_1 = require("../dao/ChainHeightDao");
const transaction_1 = require("./tx/transaction");
class BlockChain {
    get $lastACKHash() {
        return this.lastACKHash;
    }
    set $lastACKHash(value) {
        this.lastACKHash = value;
    }
    constructor(hash) {
        this.lastACKHash = hash;
    }
    addGenisisBlock(block) {
        this.lastACKHash = block.$hash;
        BlockDao_1.BlockDao.getSingletonInstance().saveBlock(block);
        LatestHashDao_1.LatestHash.getSingletonInstance().saveLhash(block.$hash);
        // 记录高度
        ChainHeightDao_1.ChainHeightDao.getSingletonInstance().update(1);
    }
    addBlock(block) {
        let pow = new ProofOfWork_1.ProofOfWork(Number(config.factor), block);
        let result = pow.mineGold();
        if (result instanceof Error) {
            return console.error('fatal error, system down during mining!');
        }
        if (pow.verify(result)) {
            console.log('block块被验证通过');
            block.$ack_num += 1;
            block.$height = ChainHeightDao_1.ChainHeightDao.getSingletonInstance().getHeight();
            block.$timestamp = Date.now();
            this.lastACKHash = block.$hash;
            BlockDao_1.BlockDao.getSingletonInstance().saveBlock(block);
            LatestHashDao_1.LatestHash.getSingletonInstance().saveLhash(block.$hash);
            // 记录高度
            ChainHeightDao_1.ChainHeightDao.getSingletonInstance().update(1);
        }
        else {
            console.warn(`block验证出错，当前block info:\n ${JSON.stringify(block)}  目标为 ${pow.$goal.toString(16)}`);
        }
    }
    addBlockToConsensus(data) {
        console.log('添加需要运算的block');
        let blockSize = 0;
        data.length && data.forEach((tx) => {
            blockSize += tx.getLength();
        });
        let block = new block_1.Block(blockSize, '', LatestHashDao_1.LatestHash.getSingletonInstance().getLhash(), Date.now(), 0, 0, data);
        this.addBlock(block);
        console.log('*********************************************');
    }
    addBlockWithMeta(txs, nonce, factor = 0) {
        let block = new block_1.Block(0, '', LatestHashDao_1.LatestHash.getSingletonInstance().getLhash(), Date.now(), factor, nonce, txs);
        block.setBlockSize();
        block.$hash = block.computeHash();
        this.lastACKHash = block.$hash;
        BlockDao_1.BlockDao.getSingletonInstance().saveBlock(block);
        LatestHashDao_1.LatestHash.getSingletonInstance().saveLhash(block.$hash);
        // 记录高度
        ChainHeightDao_1.ChainHeightDao.getSingletonInstance().update(1);
    }
    static createGenesisBlock(toAddress, info) {
        let data = 'Genesis block, start the world...';
        let Gblock = new block_1.Block((Buffer.byteLength(data)), '', '', Date.now(), 0, 0, [transaction_1.Transaction.createCoinbaseTx(toAddress, info)]);
        let hash = Gblock.computeHash();
        Gblock.$hash = hash;
        Gblock.$height = ChainHeightDao_1.ChainHeightDao.getSingletonInstance().getHeight();
        return Gblock;
    }
    static createBlockChain() {
        if (!LatestHashDao_1.LatestHash.getSingletonInstance().getLhash()) {
            // 添加创世区块
            let Gblock = BlockChain.createGenesisBlock('中本聪', 'zhongbencong');
            let blockChain = new BlockChain(Gblock.$hash);
            blockChain.addGenisisBlock(Gblock);
            return blockChain;
        }
        else {
            return new BlockChain(LatestHashDao_1.LatestHash.getSingletonInstance().getLhash());
        }
    }
    // 恢复区块链
    static restoreBlockchainFromDB() {
        // 当前区块链上为空
        if (!LatestHashDao_1.LatestHash.getSingletonInstance().getLhash()) {
            throw new TypeError('恢复出错，数据库中没有任何区块记录');
        }
        return new BlockChain(LatestHashDao_1.LatestHash.getSingletonInstance().getLhash());
    }
    printChain() {
        let block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(this.lastACKHash);
        while (block && block instanceof block_1.Block) {
            console.log('----------------------------------------');
            console.log(`current block hash: ${block.$hash}`);
            console.log(`prev hash: ${block.$prevHash}`);
            console.log(`current nonce: ${block.$nonce}`);
            console.log(`current block info: ${JSON.stringify(block.$txs)}`);
            console.log(`current block vefiry number: ${block.$ack_num}`);
            console.log(`time: ${moment(new Date(block.$timestamp)).format('YYYY-MM-DD HH:mm:ss')}`);
            block = BlockDao_1.BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
    }
}
exports.BlockChain = BlockChain;
//# sourceMappingURL=blockchain.js.map