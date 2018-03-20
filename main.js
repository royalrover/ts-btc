"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./module/blockchain");
const timers_1 = require("timers");
const transaction_1 = require("./module/tx/transaction");
const fs = require("fs");
function wait(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            timers_1.setTimeout(res, time);
        });
    });
}
function clearDB() {
    ['./vdb/blocks.json', './vdb/chainHeight.json', './vdb/lhash.json'].forEach((p) => {
        fs.writeFileSync(p, JSON.stringify({}, null, 2), {
            encoding: 'utf8',
        });
    });
}
function main() {
    clearDB();
    let chain = blockchain_1.BlockChain.createBlockChain();
    /* chain.addBlockToConsensus('Alesis Hunter 转账给 Arsène Wenger 10yen');
    chain.addBlockToConsensus('Alex Sanchez 转账给 Arron Ramsey 175$');
    chain.addBlockToConsensus('Jack Wilshere 转账给 Arsenal 8yen(罚款)');
    chain.addBlockToConsensus('Arsenal 转账给 Mesut Özil 300000$(周薪)'); */
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿森纳fc', 'No.4th')], 45, 20);
    chain.addBlockWithMeta([transaction_1.Transaction.createCoinbaseTx('阿莱士亨特', 'AH')], 45, 20);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Alesis Hunter', '阿莱士亨特', 'AH', 'Arsène Wenger', '温格', 5)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Arsenal', '阿森纳fc', 'No.4th', 'Alex Sanchez', '桑切斯', 20)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Arsenal', '阿森纳fc', 'No.4th', 'Jack Wilshere', '小威胁', 10)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Alex Sanchez', '桑切斯', 'aschz', 'Arron Ramsey', '拉神', 1.75)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Jack Wilshere', '小威胁', '太子爷', '阿森纳fc', '阿森纳fc', 0.8)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Arsenal', '阿森纳fc', 'No.4th', 'Mesut Özil', '大眼仔', 30)]);
    chain.addBlockToConsensus([transaction_1.Transaction.createTransaction('Arsenal', '阿森纳fc', 'No.4th', 'Arron Ramsey', '拉神', 15)]);
    //    let chain = BlockChain.restoreBlockchainFromDB();
    chain.printChain();
}
main();
//# sourceMappingURL=main.js.map