import * as moment from 'moment';
import {Block} from './block';
import { ProofOfWork } from './ProofOfWork';
import * as config from '../pow.config.json';

export class BlockChain {
    private chain: Array<Block>;

    constructor (){
        this.chain = [];
    }

    private addGenisisBlock(block: Block){
        this.chain.push(block);
    }

    public addBlock(block: Block){
        let pow = new ProofOfWork(Number(config.factor), block);
        let result = pow.mineGold();
        if(result instanceof Error){
            return console.error('fatal error, system down during mining!');
        }

        if(pow.verify(result)){
            console.log('block块被验证通过');
            block.$ack_num += 1; 
            block.$height = this.chain.length - 1;
            block.$timestamp = Date.now();
            this.chain.push(block);
        }else{
            console.warn(`block验证出错，当前block info:\n ${JSON.stringify(block)}  目标为 ${pow.$goal.toString(16)}`);
        }
        
    }

    public addBlockToConsensus(data: string){
        console.log('添加需要运算的block');
        let block = new Block(Buffer.byteLength(data), '', this.chain[this.chain.length - 1].$hash, Date.now(), 0, 0, data);
        this.addBlock(block);
        console.log('*********************************************');
    }

    public addBlockWithMeta(data: string, nonce: number, factor = 0){
        let block = new Block(Buffer.byteLength(data), '', this.chain[this.chain.length - 1].$hash, Date.now(), factor, nonce, data);
        block.computeHash();
        this.chain.push(block);
    }

    public createGenesisBlock(){
        let data = 'Genesis block, start the world...';
        let Gblock = new Block((Buffer.byteLength(data)), '', '', Date.now(), 0, 0, data);
        let hash = Gblock.computeHash();
        Gblock.$hash = hash;
        return Gblock;
    }

    public static initBlockchain(){
        let blockChain = new BlockChain();
        let Gblock = blockChain.createGenesisBlock();
        blockChain.addGenisisBlock(Gblock);
        return blockChain;
    }

    public printChain(){
        this.chain.forEach((block)=>{
            console.log('----------------------------------------');
            console.log(`current block hash: ${block.$hash}`);
            console.log(`prev hash: ${block.$prevHash}`);
            console.log(`current nonce: ${block.$nonce}`);
            console.log(`current block info: ${block.$deal_data}`);
            console.log(`current block vefiry number: ${block.$ack_num}`);
            console.log(`time: ${moment(new Date(block.$timestamp)).format('YYYY-MM-DD HH:mm:ss') }`);
        });
    }
    
}