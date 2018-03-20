import { Writable } from "stream";
import * as fs from 'fs';
import * as path from 'path';
import * as config from "../pow.config.json";
import { Block } from '../module/block';

export class LatestHash {
    private dbPath: string;
    public static prefix = 'latesthash_';
    private static singleton: LatestHash;

    constructor (){
        this.dbPath = path.join(config.dbpath,'lhash.json');
    }

    public static getSingletonInstance (){
        if(LatestHash.singleton){
            return LatestHash.singleton;
        }else{
            return new LatestHash();
        }
    }

    saveLhash (hash: string){
        let key = LatestHash.prefix;
        delete require.cache[this.dbPath];
        let lhashDb = require(this.dbPath);
        lhashDb[key] = hash;
        
        fs.writeFileSync(this.dbPath,JSON.stringify(lhashDb,null,2),{
            encoding: 'utf8',
        });
    }

    getLhash (){
        delete require.cache[this.dbPath];
        let hashDb = require(this.dbPath);
        if(!hashDb)
            return null;
        return hashDb[LatestHash.prefix];
    }

}