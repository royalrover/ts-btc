import { Writable } from "stream";
import * as fs from 'fs';
import * as path from 'path';
import * as config from "../pow.config.json";
import { Block } from '../module/block';

export class ChainHeightDao {
    private dbPath: string;
    private prefix = 'height';
    public static singleton: ChainHeightDao;

    constructor (){
        this.dbPath = path.join(config.dbpath,'chainHeight.json');
    }

    public static getSingletonInstance (){
        if(ChainHeightDao.singleton){
            return ChainHeightDao.singleton;
        }else{
            return new ChainHeightDao();
        }
    }

    update (count: number = 1){
        let c = this.getHeight() + count;
        fs.writeFileSync(this.dbPath,JSON.stringify({
            height: c
        },null,2),{
            encoding: 'utf8',
        });
    }

    getHeight (){
        delete require.cache[this.dbPath];
        let heightDb = require(this.dbPath);
        if(!heightDb || !heightDb[this.prefix])
            return 1;
        return heightDb[this.prefix];
    }

}