import { BlockChain } from './module/blockchain';
import {Block} from './module/block';
import { setTimeout } from 'timers';
import { Transaction } from './module/tx/transaction';
import * as fs from 'fs';

async function wait(time: number): Promise<any> {
    return new Promise((res,rej)=>{
        setTimeout(res,time);
    })
}

function clearDB(){
    ['./vdb/blocks.json','./vdb/chainHeight.json','./vdb/lhash.json'].forEach((p)=>{
        fs.writeFileSync(p,JSON.stringify({},null,2),{
            encoding: 'utf8',
        });
    });
}

function main(){
    clearDB();
    let chain = BlockChain.createBlockChain();
    /* chain.addBlockToConsensus('Alesis Hunter 转账给 Arsène Wenger 10yen');
    chain.addBlockToConsensus('Alex Sanchez 转账给 Arron Ramsey 175$');
    chain.addBlockToConsensus('Jack Wilshere 转账给 Arsenal 8yen(罚款)');
    chain.addBlockToConsensus('Arsenal 转账给 Mesut Özil 300000$(周薪)'); */

    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿森纳fc','No.4th')],45,20);
    chain.addBlockWithMeta([Transaction.createCoinbaseTx('阿莱士亨特','AH')],45,20);
    chain.addBlockToConsensus([Transaction.createTransaction('Alesis Hunter','阿莱士亨特','AH','Arsène Wenger','温格',5)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Arsenal','阿森纳fc','No.4th','Alex Sanchez','桑切斯',20)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Arsenal','阿森纳fc','No.4th','Jack Wilshere','小威胁',10)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Alex Sanchez','桑切斯','aschz','Arron Ramsey','拉神',1.75)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Jack Wilshere','小威胁','太子爷','阿森纳fc','阿森纳fc',0.8)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Arsenal','阿森纳fc','No.4th','Mesut Özil','大眼仔',30)]);
    chain.addBlockToConsensus([Transaction.createTransaction('Arsenal','阿森纳fc','No.4th','Arron Ramsey','拉神',15)]);

//    let chain = BlockChain.restoreBlockchainFromDB();
    chain.printChain();

}

main();