"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const config = require("../pow.config.json");
class LatestHash {
    constructor() {
        this.dbPath = path.join(config.dbpath, 'lhash.json');
    }
    static getSingletonInstance() {
        if (LatestHash.singleton) {
            return LatestHash.singleton;
        }
        else {
            return new LatestHash();
        }
    }
    saveLhash(hash) {
        let key = LatestHash.prefix;
        delete require.cache[this.dbPath];
        let lhashDb = require(this.dbPath);
        lhashDb[key] = hash;
        fs.writeFileSync(this.dbPath, JSON.stringify(lhashDb, null, 2), {
            encoding: 'utf8',
        });
    }
    getLhash() {
        delete require.cache[this.dbPath];
        let hashDb = require(this.dbPath);
        if (!hashDb)
            return null;
        return hashDb[LatestHash.prefix];
    }
}
LatestHash.prefix = 'latesthash_';
exports.LatestHash = LatestHash;
//# sourceMappingURL=LatestHashDao.js.map