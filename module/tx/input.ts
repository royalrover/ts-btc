export class Input {
    private txId: string;
    private outputIndex: number;
    private unlockScript: string;

	public get $txId(): string {
		return this.txId;
	}

	public set $txId(value: string) {
		this.txId = value;
    }
    
	public get $outputIndex(): number {
		return this.outputIndex;
	}

	public set $outputIndex(value: number) {
		this.outputIndex = value;
	}

	public get $unlockScript(): string {
		return this.unlockScript;
	}

	public set $unlockScript(value: string) {
		this.unlockScript = value;
	}
    
    constructor(txId: string, index: number, unlockScript: string){
        this.txId = txId;
        this.outputIndex = index;
        this.unlockScript = unlockScript;
    }

    // 反序列化，进行类型转换
    public static createInputsFromUnserialize(objs: Array<Input>){
        let ins = [];
        objs.forEach((obj)=>{
            ins.push(new Input(obj.txId,obj.outputIndex,obj.unlockScript));
        });
        return ins;
    }
    
    canUnlock (privateKey: string): boolean{
        if(privateKey == this.unlockScript){
            return true;
        }else{
            return false;
        }
    }
}