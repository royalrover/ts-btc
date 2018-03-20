"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const config = require("../pow.config.json");
const block_1 = require("../module/block");
class BlockDao {
    constructor() {
        this.dbPath = path.join(config.dbpath, 'blocks.json');
    }
    static getSingletonInstance() {
        if (BlockDao.singleton) {
            return BlockDao.singleton;
        }
        else {
            return new BlockDao();
        }
    }
    saveBlock(block) {
        let key = `${BlockDao.prefix}${block.$hash}`;
        delete require.cache[this.dbPath];
        let blockDb = require(this.dbPath);
        blockDb[key] = block;
        // 需同步写入，防止异步写入间隙 磁盘文件未更新的
        fs.writeFileSync(this.dbPath, JSON.stringify(blockDb, null, 2), {
            encoding: 'utf8',
        });
    }
    getBlock(hash) {
        delete require.cache[this.dbPath];
        let blockDb = require(this.dbPath);
        if (!blockDb)
            return null;
        let block = blockDb[`${BlockDao.prefix}${hash}`];
        if (!block)
            return null;
        let b = new block_1.Block(block.blockSize, block.hash, block.prevHash, block.timestamp, block.diffcult_factor, block.nonce, block.txs);
        b.$ack_num = block.ack_num;
        b.$height = block.height;
        b.$minner = block.minner;
        return b;
    }
}
BlockDao.prefix = 'block_';
// block个数
BlockDao.height = 0;
exports.BlockDao = BlockDao;
//# sourceMappingURL=BlockDao.js.map