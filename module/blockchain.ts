import * as moment from 'moment';
import {Block} from './block';
import { ProofOfWork } from './ProofOfWork';
import * as config from '../pow.config.json';
import { BlockDao } from '../dao/BlockDao';
import { LatestHash as LatestHashDao } from '../dao/LatestHashDao';
import { ChainHeightDao } from '../dao/ChainHeightDao';
import { Transaction } from './tx/transaction';
import { Input } from './tx/input';

export class BlockChain {
    private lastACKHash: string;

	public get $lastACKHash(): string {
		return this.lastACKHash;
	}

	public set $lastACKHash(value: string) {
		this.lastACKHash = value;
	}

    constructor (hash: string){
        this.lastACKHash = hash;
    }

    private addGenisisBlock(block: Block){
        this.lastACKHash = block.$hash;
        BlockDao.getSingletonInstance().saveBlock(block);
        LatestHashDao.getSingletonInstance().saveLhash(block.$hash);
        // 记录高度
        ChainHeightDao.getSingletonInstance().update(1);
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
            block.$height = ChainHeightDao.getSingletonInstance().getHeight();
            block.$timestamp = Date.now();
            this.lastACKHash = block.$hash;
            BlockDao.getSingletonInstance().saveBlock(block);
            LatestHashDao.getSingletonInstance().saveLhash(block.$hash);
            // 记录高度
            ChainHeightDao.getSingletonInstance().update(1);
        }else{
            console.warn(`block验证出错，当前block info:\n ${JSON.stringify(block)}  目标为 ${pow.$goal.toString(16)}`);
        }
        
    }

    public addBlockToConsensus(data: Array<Transaction>){
        console.log('添加需要运算的block');
        let blockSize = 0;
        data.length && data.forEach((tx)=>{
            blockSize += tx.getLength();
        });
        let block = new Block(blockSize, '', LatestHashDao.getSingletonInstance().getLhash(), Date.now(), 0, 0, data);
        this.addBlock(block);
        console.log('*********************************************');
    }

    public addBlockWithMeta(txs: Array<Transaction>, nonce: number, factor = 0){
        let block = new Block(0, '', LatestHashDao.getSingletonInstance().getLhash(), Date.now(), factor, nonce, txs);
        block.setBlockSize();
        block.$hash = block.computeHash();
        this.lastACKHash = block.$hash;
        BlockDao.getSingletonInstance().saveBlock(block);
        LatestHashDao.getSingletonInstance().saveLhash(block.$hash);
        // 记录高度
        ChainHeightDao.getSingletonInstance().update(1);
    }
    
    public static createGenesisBlock(toAddress: string, info: string){
        let data = 'Genesis block, start the world...';
        let Gblock = new Block((Buffer.byteLength(data)), '', '', Date.now(), 0, 0, [Transaction.createCoinbaseTx(toAddress,info)]);
        let hash = Gblock.computeHash();
        Gblock.$hash = hash;
        Gblock.$height = ChainHeightDao.getSingletonInstance().getHeight();
        return Gblock;
    }

    public static createBlockChain(){
        if(!LatestHashDao.getSingletonInstance().getLhash()){
            // 添加创世区块
            let Gblock = BlockChain.createGenesisBlock('中本聪','zhongbencong');
            let blockChain = new BlockChain(Gblock.$hash);
            blockChain.addGenisisBlock(Gblock);
            return blockChain;
        }else{
            return new BlockChain(LatestHashDao.getSingletonInstance().getLhash());
        }
        
    }

    // 恢复区块链
    public static restoreBlockchainFromDB(){
        // 当前区块链上为空
        if(!LatestHashDao.getSingletonInstance().getLhash()){
            throw new TypeError('恢复出错，数据库中没有任何区块记录');
        }

        return new BlockChain(LatestHashDao.getSingletonInstance().getLhash());
    }

    public printChain(){
        let block = BlockDao.getSingletonInstance().getBlock(this.lastACKHash);
        while(block && block instanceof Block){
            console.log('----------------------------------------');
            console.log(`current block hash: ${block.$hash}`);
            console.log(`prev hash: ${block.$prevHash}`);
            console.log(`current nonce: ${block.$nonce}`);
            console.log(`current block info: ${JSON.stringify(block.$txs)}`);
            console.log(`current block vefiry number: ${block.$ack_num}`);
            console.log(`time: ${moment(new Date(block.$timestamp)).format('YYYY-MM-DD HH:mm:ss') }`);
            block = BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
    }
    
}