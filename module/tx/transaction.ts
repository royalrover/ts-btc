import { Input } from './input';
import { Output } from './output';
import { Buffer } from 'buffer';
import * as crypto from 'crypto';
import { BlockChain } from '../blockchain';
import { BlockDao } from '../../dao/BlockDao';
import { Block } from '../block';

const AWARD = 12.5;
let chain: BlockChain;
export class Transaction {
    private txId: string;
    private inputTxs: Array<Input>;
    private outputTxs: Array<Output>;

    constructor(txId: string, inputs: Array<Input>, outputs: Array<Output>){
        this.txId = txId;
        this.inputTxs = inputs;
        this.outputTxs = outputs;
    }

	public get $txId(): string {
		return this.txId;
	}

	public set $txId(value: string) {
		this.txId = value;
	}

	public get $inputTxs(): Array<Input> {
		return this.inputTxs;
	}

	public set $inputTxs(value: Array<Input>) {
		this.inputTxs = value;
	}

	public get $outputTxs(): Array<Output> {
		return this.outputTxs;
	}

	public set $outputTxs(value: Array<Output>) {
		this.outputTxs = value;
	}

    // 反序列化，进行类型转换
    public static createTransactionFromUnserialize(objs: Array<Transaction>){
        let txs = [];
        objs.forEach((obj)=>{
            txs.push(new Transaction(obj.txId,Input.createInputsFromUnserialize(obj.inputTxs),Output.createOnputsFromUnserialize(obj.outputTxs)));
        });
        return txs;
    }

    public getLength(): number{
        let len = 0;
        if(this.txId){
            len += Buffer.byteLength(this.txId);
        }
        if(this.inputTxs.length){
            this.inputTxs.forEach((input)=>{
                len += Buffer.byteLength(input.$txId + input.$outputIndex);
            });
        }
        if(this.outputTxs.length){
            this.outputTxs.forEach((output)=>{
                len += Buffer.byteLength(output.$value + '');
            });
        }
        return len;
    }

    /* 
        1.交易结构各字段序列化为字节数组
        2.把字节数组拼接为支付串
        3.对支付串计算两次SHA256 得到交易hash 
    */
    public setTxId(){
        let sha256 = crypto.createHash('sha256');
        sha256.update(JSON.stringify(this.inputTxs) + JSON.stringify(this.outputTxs) + Date.now(),'utf8');
        this.txId = sha256.digest('hex');
    }

    // coinbase交易用于给矿工奖励，input为空，output为矿工报酬
    public static createCoinbaseTx(pubKey: string, info: string){
        let input = new Input('',-1,info);
        let output = new Output(AWARD, pubKey);
        let tx = new Transaction('',[input],[output])
        tx.setTxId();
        return tx;
    }

    public static isCoinbaseTx(tx: Transaction){
        if(tx.$inputTxs.length == 1 && tx.$inputTxs[0].$outputIndex == -1 && tx.$inputTxs[0].$txId == ''){
            return true;
        }else{
            return false;
        }
    }

    // 创建转账交易
    public static createTransaction(from: string, fromPubkey: string, fromKey: string, to: string, toPubkey: string, coin: number){
        let outputs = this.findUTXOToTransfer(fromKey, coin);
        console.log(`UTXOToTransfer： ${JSON.stringify(outputs)}, from: ${from} to ${to} transfer ${coin}`)
        let inputTx = [], sum = 0, outputTx = [];
        outputs.forEach((o)=>{
            sum += o.$value;
            inputTx.push(new Input(o.$txId,o.$index,fromKey));
        });

        if(sum < coin){
            throw Error(`余额不足，转账失败! from ${from} to ${to} transfer ${coin}btc, but only have ${sum}btc`);
        }

        // 公钥锁住脚本
        outputTx.push(new Output(coin,toPubkey));
        if(sum > coin){
            outputTx.push(new Output(sum-coin,fromPubkey));
        }
        let tx = new Transaction('',inputTx,outputTx);
        tx.setTxId();
        return tx;
    }   

    // 获取某用户的所有已花费的output
    public static getAllSpentOutput(secreteKey: string){
        // outputHash键为txid，值为outputIndex
        let outputIndexHash = {};
        chain = BlockChain.createBlockChain();
        let block = BlockDao.getSingletonInstance().getBlock(chain.$lastACKHash);
        while(block && block instanceof Block){
            block.$txs && block.$txs.forEach((tx)=>{
                if(Transaction.isCoinbaseTx(tx)){
                /*     if(tx.$inputTxs[0].canUnlock(secreteKey)){
                        outputIndexHash[tx.$txId] = 0;
                    } */
                    return;
                }
                    
                tx.$inputTxs && tx.$inputTxs.forEach((input,i)=>{
                    if(input.canUnlock(secreteKey)){
                        outputIndexHash[input.$txId] = input.$outputIndex;
                    }
                });
            });
            block = BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
        return outputIndexHash;
    }

    public static getAllUnspentOutputTx(secreteKey: string): Array<Transaction>{
        let outputIndexHash: Object = this.getAllSpentOutput(secreteKey);
    //    console.log('outputIndexHash ',outputIndexHash)
        let unspentOutputsTx = [];
        let keys = Object.keys(outputIndexHash);
        let block = BlockDao.getSingletonInstance().getBlock(chain.$lastACKHash);
        while(block && block instanceof Block){
            block.$txs && block.$txs.forEach((tx)=>{
                /* if(keys.includes(tx.$txId)){
                    console.log('-->'+tx.$txId,JSON.stringify(tx.$outputTxs))
                    tx.$outputTxs.forEach((output,i)=>{
                        // 过滤已消费的output
                        if(i == outputIndexHash[tx.$txId])
                            return;
                        
                        if(output.canUnlock(secreteKey)){
                            output.$txId = tx.$txId;
                            output.$index = i;
                            unspentOutputs.push(output);
                        }    
                    });
                }else
                // 如果是coinbase
                if(Transaction.isCoinbaseTx(tx)){
                    if(tx.$inputTxs[0].canUnlock(secreteKey)){
                        tx.$outputTxs[0].$txId = tx.$txId;
                        tx.$outputTxs[0].$index = 0;
                        unspentOutputs.push(tx.$outputTxs[0]);
                    } 
                    return;
                }// 如果没有找到该用户的input，说明该用户并没有进行转账，因此遍历所有的tx寻找他的utxo
                else if(!keys.length){
                    tx.$outputTxs.forEach((output,i)=>{
                        if(output.canUnlock(secreteKey)){
                            output.$txId = tx.$txId;
                            output.$index = i;
                            unspentOutputs.push(output);
                        }    
                    });
                } */
                if(keys.includes(tx.$txId)){
                //    console.log('-->'+tx.$txId,JSON.stringify(tx.$outputTxs))
                    tx.$outputTxs.forEach((output,i)=>{
                        // 过滤已消费的output
                        if(i == outputIndexHash[tx.$txId])
                            return;
                        
                        if(output.canUnlock(secreteKey)){
                            unspentOutputsTx.push(tx);
                        }    
                    });
                }else{
                    for(let i=0,len=tx.$outputTxs.length;i<len;i++){
                        let output = tx.$outputTxs[i];
                        if(output.canUnlock(secreteKey)){
                            unspentOutputsTx.push(tx);
                            break;
                        }    
                    }
                }
            });
            block = BlockDao.getSingletonInstance().getBlock(block.$prevHash);
        }
        return unspentOutputsTx;
    }

    public static findUTXOToTransfer(secreteKey: string, transferCoin: number): Array<Output>{
        let unspentOutputsTx = this.getAllUnspentOutputTx(secreteKey); 
    //    console.log('unspentOutputsTx ',unspentOutputsTx)
        let UTXOSort = function (keyName) {
            return function (objectN, objectM) {
             var valueN = objectN[keyName]
             var valueM = objectM[keyName]
             if (valueN < valueM) return -1
             else if (valueN > valueM) return 1
             else return 0
            }
        };
        let outputs = [], utxos = [], sum = 0;
        unspentOutputsTx.forEach((tx)=>{
            tx.$outputTxs && tx.$outputTxs.forEach((out,i)=>{
                if(out.canUnlock(secreteKey)){
                    out.$txId = tx.$txId;
                    out.$index = i;
                    outputs.push(out);
                }
            });
        });
        outputs = outputs.sort(UTXOSort('value'));

        outputs.forEach((utxo)=>{
            if(sum < transferCoin){
                utxos.push(utxo);
            }
            sum += utxo.$value;
        });
        
        return utxos;
    }

}