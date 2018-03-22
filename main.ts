import { BlockChain } from './module/blockchain';
import {Block} from './module/block';
import { setTimeout } from 'timers';

async function wait(time: number): Promise<any> {
    return new Promise((res,rej)=>{
        setTimeout(res,time);
    })
}

function main(){
    let chain = BlockChain.initBlockchain();
    chain.addBlockToConsensus('Alesis Hunter 转账给 Arsène Wenger 10yen');
//    await wait(1000);
    chain.addBlockToConsensus('Alex Sanchez 转账给 Arron Ramsey 175$');
//    await wait(2000);
    chain.addBlockToConsensus('Jack Wilshere 转账给 Arsenal 8yen(罚款)');
//    await wait(1000);
    chain.addBlockToConsensus('Arsenal 转账给 Mesut Özil 300000$(周薪)');

    chain.printChain();

}

main();