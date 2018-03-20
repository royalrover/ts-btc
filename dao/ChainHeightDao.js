"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const config = require("../pow.config.json");
class ChainHeightDao {
    constructor() {
        this.prefix = 'height';
        this.dbPath = path.join(config.dbpath, 'chainHeight.json');
    }
    static getSingletonInstance() {
        if (ChainHeightDao.singleton) {
            return ChainHeightDao.singleton;
        }
        else {
            return new ChainHeightDao();
        }
    }
    update(count = 1) {
        let c = this.getHeight() + count;
        fs.writeFileSync(this.dbPath, JSON.stringify({
            height: c
        }, null, 2), {
            encoding: 'utf8',
        });
    }
    getHeight() {
        delete require.cache[this.dbPath];
        let heightDb = require(this.dbPath);
        if (!heightDb || !heightDb[this.prefix])
            return 1;
        return heightDb[this.prefix];
    }
}
exports.ChainHeightDao = ChainHeightDao;
//# sourceMappingURL=ChainHeightDao.js.map