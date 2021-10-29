const cryptoHash = require('./crypto-hash');

describe('cryptoHash()',()=>{
    
    it('generate a SHA-256 hashed output',()=>{
        expect(cryptoHash('world'))
            .toEqual('09bf524dc6f5272161e2c2fc597da23610dbd1af8411226b5f5dae77658237cc');
    });

    it('produces the same hash with the same input argument in any oter',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','one','two'));
    });

    it('produces a unique hash when the properties have changed on an input',()=>{
        const foo = {};

        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);

    })
});