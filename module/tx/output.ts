import * as rsaConfig from '../../rsa.json';
export class Output {
    private value: number;
    // 锁定脚本，需要使用UTXO归属者用私钥进行签名通过
    // 当解锁UTXO成功后，此UTXO变为下一个交易的交易输入，同时使用接收方的地址（公钥）锁定本次交易的交易输出，
    // 等待接收方使用私钥签名使用该UTXO
    // 因此，btc没有账户的概念，所有的“钱”由自己的公钥所加密保存，只有用自己的私钥才能使用这些钱（即解锁了UTXO的解锁脚本）
    private lockScript: string;

    // 该属性仅仅在交易时使用，设置属性
    private txId: string;

    // 该属性仅仅在交易时使用，设置属性
    private index: number;

	public get $index(): number {
		return this.index;
	}

	public set $index(value: number) {
		this.index = value;
	}
    
	public get $txId(): string {
		return this.txId;
	}

	public set $txId(value: string) {
		this.txId = value;
	}
    

	public get $value(): number {
		return this.value;
	}

	public set $value(value: number) {
		this.value = value;
	}

	/* public get $lockScript(): string {
		return this.lockScript;
	}

	public set $lockScript(value: string) {
		this.lockScript = value;
	} */
    
    constructor(value: number,publicKey: string){
        this.value = value;
        this.lockScript = publicKey;
    }

    // 反序列化，进行类型转换
    public static createOnputsFromUnserialize(objs: Array<Output>){
        let outs = [];
        objs.forEach((obj)=>{
            outs.push(new Output(obj.value,obj.lockScript));
        });
        return outs;
    }

    public canUnlock(privateKey: string): boolean{
        if(privateKey == rsaConfig[this.lockScript]){
            return true;
        }else{
            return false;
        }
    }
}