"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var ProofOfWork = /** @class */ (function () {
    function ProofOfWork(factor, block) {
        if (factor === void 0) { factor = 6; }
        this.diffcult_factor = factor;
        this.block = block;
        this.setGoal();
    }
    Object.defineProperty(ProofOfWork.prototype, "$diffcult_factor", {
        get: function () {
            return this.diffcult_factor;
        },
        set: function (value) {
            this.diffcult_factor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProofOfWork.prototype, "$block", {
        get: function () {
            return this.block;
        },
        set: function (value) {
            this.block = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProofOfWork.prototype, "$goal", {
        get: function () {
            return this.goal;
        },
        set: function (value) {
            this.goal = value;
        },
        enumerable: true,
        configurable: true
    });
    ProofOfWork.prototype.setGoal = function () {
        this.goal = Math.pow(2, 256 - this.$diffcult_factor);
    };
    ProofOfWork.prototype.mineGold = function () {
        var counter = this.block.$nonce;
        var factor = this.diffcult_factor;
        var block = this.block;
        var p1 = process.uptime() * 1000;
        console.log('开始挖矿');
        try {
            do {
                var hash = block.computeHash();
                /* if(counter % 1000000 == 0){
                    console.log(counter,hash,Number.parseInt(hash,16),this.goal)
                } */
                if (Number.parseInt(hash, 16) <= this.goal) {
                    console.log('*********************************************');
                    console.log("wow\uFF0C\u6316\u5230\u77FF\u5566\uFF0C\u5386\u65F6" + (process.uptime() * 1000 - p1) + "s");
                    console.log("current hash: " + hash + "    goal: " + this.goal.toString(16));
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
    };
    ProofOfWork.prototype.verify = function (block) {
        var nonce = block.$nonce;
        var sha256 = crypto.createHash('sha256');
        sha256.update("" + block.$prevHash + nonce.toString(16) + block.$deal_data, 'utf8');
        var hash = sha256.digest('hex');
        if (Number.parseInt(hash, 16) <= this.goal) {
            return true;
        }
        else {
            return false;
        }
    };
    return ProofOfWork;
}());
exports.ProofOfWork = ProofOfWork;
//# sourceMappingURL=ProofOfWork.js.map