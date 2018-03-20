"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class ProofOfWork {
    get $diffcult_factor() {
        return this.diffcult_factor;
    }
    set $diffcult_factor(value) {
        this.diffcult_factor = value;
    }
    get $block() {
        return this.block;
    }
    set $block(value) {
        this.block = value;
    }
    get $goal() {
        return this.goal;
    }
    set $goal(value) {
        this.goal = value;
    }
    constructor(factor = 6, block) {
        this.diffcult_factor = factor;
        this.block = block;
        this.setGoal();
    }
    setGoal() {
        this.goal = Math.pow(2, 256 - this.$diffcult_factor);
    }
    mineGold() {
        let counter = this.block.$nonce;
        let factor = this.diffcult_factor;
        let block = this.block;
        let p1 = process.uptime() * 1000;
        console.log('开始挖矿');
        try {
            do {
                let hash = block.computeHash();
                /* if(counter % 1000000 == 0){
                    console.log(counter,hash,Number.parseInt(hash,16),this.goal)
                } */
                if (Number.parseInt(hash, 16) <= this.goal) {
                    //    console.log('*********************************************');
                    console.log(`wow，挖到矿啦，历时${process.uptime() * 1000 - p1}s`);
                    console.log(`current hash: ${hash}    goal: ${this.goal.toString(16)}`);
                    block.$hash = hash;
                    block.$diffcult_factor = factor;
                    block.$minner = 'self';
                    block.$nonce = counter;
                    break;
                }
                counter++;
                block.$nonce = counter;
            } while (counter < Number.MAX_VALUE);
        }
        catch (e) {
            console.warn(e.stack);
            return e;
        }
        return this.block;
    }
    verify(block) {
        let txids = '';
        block.$txs && block.$txs.forEach((tx) => {
            txids += tx.$txId;
        });
        let nonce = block.$nonce;
        let sha256 = crypto.createHash('sha256');
        sha256.update(`${block.$prevHash}${nonce.toString(16)}${txids}`, 'utf8');
        let hash = sha256.digest('hex');
        if (Number.parseInt(hash, 16) <= this.goal) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.ProofOfWork = ProofOfWork;
//# sourceMappingURL=ProofOfWork.js.map