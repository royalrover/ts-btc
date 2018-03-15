import * as crypto from 'crypto';
/**
 *  区块信息：
 *  区块大小：用字节表示的区块数据大小
    区块头：组成区块头的几个字段
        区块头hash值
        父区块头hash值
        时间戳：区块产生的近似时间
        Merkle根：该区块中交易的merkle树根的哈希值
        难度目标：该区块工作量证明算法的难度目标
        Nonce：用于工作量证明算法的计数器
    交易计数器：交易的数量
    交易：记录在区块里的交易信息
 */
export class Block {

	public get $hash(): string {
		return this.hash;
	}

	public set $hash(value: string) {
		this.hash = value;
	}

	public get $prevHash(): string {
		return this.prevHash;
	}

	public set $prevHash(value: string) {
		this.prevHash = value;
	}

	public get $blockSize(): number {
		return this.blockSize;
	}

	public set $blockSize(value: number) {
		this.blockSize = value;
	}

	public get $nonce(): number {
		return this.nonce;
	}

	public set $nonce(value: number) {
		this.nonce = value;
	}

	public get $minner(): string {
		return this.minner;
	}

	public set $minner(value: string) {
		this.minner = value;
	}

	public get $height(): number {
		return this.height;
	}

	public set $height(value: number) {
		this.height = value;
    }

	public get $diffcult_factor(): number {
		return this.diffcult_factor;
	}

	public set $diffcult_factor(value: number) {
		this.diffcult_factor = value;
	}

	public get $deal_data(): string {
		return this.deal_data;
	}

	public set $deal_data(value: string) {
		this.deal_data = value;
	}

	public get $ack_num(): number {
		return this.ack_num;
	}

	public set $ack_num(value: number) {
		this.ack_num = value;
    }
    
    public get $timestamp(): number {
		return this.timestamp;
	}

	public set $timestamp(value: number) {
		this.timestamp = value;
	}
    private blockSize: number;
    private hash: string;
    private prevHash: string;
    private timestamp: number;
    private diffcult_factor: number;
    private nonce: number;
    private deal_data: string;
    private minner: string;
    private ack_num: number;
    private height: number;

    constructor (size: number, hash: string, prevHash: string, timestamp: number, factor: number, nonce = 0, data: string){
        this.blockSize = size;
        this.hash = hash;
        this.prevHash = prevHash;
        this.timestamp = timestamp;
        this.diffcult_factor = factor;
        this.nonce = nonce;
		this.deal_data = data;
		this.ack_num = 0;
    }

    public createBlock(prevHash: string, factor: number, data: string){
        return new Block(0, '', prevHash, Date.now(), factor, 0, data);
    }


    public computeHash(){
        let sha256 = crypto.createHash('sha256');
        sha256.update(`${this.prevHash}${this.nonce.toString(16)}${this.deal_data}`,'utf8');
        let hash = sha256.digest('hex');
	//    this.$hash = hash;
		return hash;
    }
}