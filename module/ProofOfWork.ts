import * as crypto from 'crypto';
import { Block } from './block';
import { BlockChain } from './blockchain';

export class ProofOfWork {
    private diffcult_factor: number;
    private goal: number;
    private block: Block;

    public get $diffcult_factor(): number {
		return this.diffcult_factor;
	}

	public set $diffcult_factor(value: number) {
		this.diffcult_factor = value;
    }

	public get $block(): Block {
		return this.block;
	}

	public set $block(value: Block) {
		this.block = value;
	}
    
    public get $goal(): number {
		return this.goal;
	}

	public set $goal(value: number) {
		this.goal = value;
    }
    
    constructor (factor = 6, block: Block){
        this.diffcult_factor = factor;
        this.block = block;
        this.setGoal();
    }

    public setGoal(){
        this.goal = Math.pow(2,256 - this.$diffcult_factor);
    }

    public mineGold(){
        let counter = this.block.$nonce;
        let factor = this.diffcult_factor;
        let block = this.block;
        let p1 = process.uptime()*1000;
        console.log('开始挖矿');
        try{
            do{
                let hash = block.computeHash();
                /* if(counter % 1000000 == 0){
                    console.log(counter,hash,Number.parseInt(hash,16),this.goal)
                } */
                if(Number.parseInt(hash,16) <= this.goal){
                    console.log('*********************************************');
                    console.log(`wow，挖到矿啦，历时${process.uptime()*1000 - p1}s`);
                    console.log(`current hash: ${hash}    goal: ${this.goal.toString(16)}`);
    
                    block.$hash = hash;
                    block.$diffcult_factor = factor;
                    block.$minner = 'self';
                    block.$nonce = counter;
                    break;
                }
                counter++;
                block.$nonce = counter;
            }while(counter < Number.MAX_VALUE)
        }catch(e){
            console.warn(e.stack);
            return e;
        }

        return this.block;
    }

    public verify(block: Block){
        let nonce = block.$nonce;
        let sha256 = crypto.createHash('sha256');
        sha256.update(`${block.$prevHash}${nonce.toString(16)}${block.$deal_data}`,'utf8');
        let hash = sha256.digest('hex');
        if(Number.parseInt(hash,16) <= this.goal){
            return true;
        }else{
            return false;
        }
    }

}