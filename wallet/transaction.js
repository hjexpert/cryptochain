//const uuid = require('uuid/v1');
const { v1: uuid } = require('uuid');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');




class Transaction {
    constructor({senderWallet, recipient, amount, outputMap, input }){
        
        this.id = uuid();
        ///console.log('the uuid for transaction %s',this.id)
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        //console.log('the recipient for transaction %s',recipient);

        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });

    }

    createInput({senderWallet, outputMap}){

        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap) //re-sign the outputMap

        };
    }

    createOutputMap({senderWallet, recipient, amount}){
        const outputMap = {};

        outputMap[recipient] = amount;
        //수신자 이름으로 송금액이 얼마인지

        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        //공개키(계좌로) 송신자의 계좌의 잔고를 업데이트 함

       // console.log('the outputMap for transaction %s',outputMap);
        return outputMap;

    }

    update({senderWallet, recipient, amount}){
        if (amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }
        
        
        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
          } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        this.outputMap[senderWallet.publicKey] = 
            this.outputMap[senderWallet.publicKey] - amount;

        this.input = this.createInput({senderWallet, outputMap: this.outputMap});
    }

    static validTransaction(transaction){

        const {input: {address, amount, signature}, outputMap} = transaction;
         
        const outputTotal = Object.values(outputMap)
          .reduce((total,outputAmount)=> total + outputAmount);

        if(amount !== outputTotal){
            console.error(`Invalid transaction from ${address}`);
            return false;
        }
        
        if(!verifySignature({publicKey: address, data: outputMap, signature})){
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    }

    static rewardTransaction({minerWallet}){
//        console.log('logs for minerWallet', minerWallet);
//        console.log('logs for minerWallet.publicKey', minerWallet.publicKey);

        let thisOutputMap = {[minerWallet.publicKey] : MINING_REWARD};

//        console.log('logs for OUTPUTMAP', thisOutputMap);
        return new this({
            input: REWARD_INPUT,
            outputMap: {[minerWallet.publicKey]: MINING_REWARD }
          });    }
}


module.exports = Transaction;