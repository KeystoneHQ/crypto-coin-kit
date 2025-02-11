import keyProvider from '../../BTC/keyProvider';
import {LTC} from '../../LTC';

const privateKey =
  'daf22c62736fede949674e4240a6de143bb2b945d533e551bae01a33c31ab202';
const publicKey =
  '0203bcea542e8e16830fd5a8cbbf36419aa7b23b723e316081a720966dfb280190';

const kp1 = keyProvider(privateKey, publicKey);

// https://live.blockcypher.com/ltc/tx/7d394fe2946d47d7fe1e3192bf5d93ef6fdc9596790029cffde345d037bdc251/
const utxoOne = {
  hash: '8917e49d39914019550e2b0b7678efe5a474d5887e4a8196216621075a46e0dc',
  index: 0,
  utxo: {
    publicKey,
    value: 2985386,
  },
  bip32Derivation: [
    {
      pubkey: Buffer.from(publicKey, 'hex'),
      masterFingerprint: Buffer.from('01010101', 'hex'),
      path: `m/49'/0'/0'/0/0`,
    },
  ],
};

describe('coin.LTC', () => {
  const ltc = new LTC();

  it('should generate correct address', () => {
    expect(ltc.generateAddress(publicKey)).toBe(
      'MWtCcUWEFTtMYZv83by9j2epVcLwYoRrKd',
    );
  });

  describe('isAddressValid', function () {
    it('should return true given a valid p2pkh address', function () {
      const validP2pkhAddress = 'LLfeanwXA7LhR92Sst46uBYn94qsR2rJ2h'
      expect(ltc.isAddressValid(validP2pkhAddress)).toBe(true);
    });

    it('should return true given a valid legacy p2sh address', function () {
      const validLegacyP2shAddress = '3EwY1PaQ5fB4M4nvWRYgUn2LNmokeJ36Pj'
      expect(ltc.isAddressValid(validLegacyP2shAddress)).toBe(true);
    });

    it('should return true given a valid p2sh address', function () {
      const validP2shAddress = 'MM9gKGzN2n2V9a4pcJY2JRGjhUQCcciCED'
      expect(ltc.isAddressValid(validP2shAddress)).toBe(true);
    });

    it('should return true given a valid native segwit address', function () {
      const validNativeSegwitAddress = 'ltc1q3qkpj5s4ru3cx9t7dt27pdfmz5aqy3wplamkns';
      expect(ltc.isAddressValid(validNativeSegwitAddress)).toBe(true);
    });

    it('should return false given an invalid native segwit address', function () {
      const invalidNativeSegwitAddress = 'ltc1q3qkpj5s4ru3cx9t7dt27pdfmz5aqy3wplamkn';
      expect(ltc.isAddressValid(invalidNativeSegwitAddress)).toBe(false);
    });
  });

  it('should convert a address', () => {
    const result = ltc.convertAddress('MM9gKGzN2n2V9a4pcJY2JRGjhUQCcciCED');
    expect(result).toBe('3EwY1PaQ5fB4M4nvWRYgUn2LNmokeJ36Pj');
    const failResult = ltc.convertAddress('3EwY1PaQ5fB4M4nvWRYgUn2LNmokeJ36Pj');
    expect(failResult).toBe('MM9gKGzN2n2V9a4pcJY2JRGjhUQCcciCED');
  });

  it('should generate the transaction', async () => {
    const txData = {
      inputs: [utxoOne],
      outputs: {
        to: 'MKkaG1dzsRykP2S3SB1Mk8KLb2f9hS7xyb',
        amount: 2985186,
        fee: 200,
        changeAddress: 'MWtCcUWEFTtMYZv83by9j2epVcLwYoRrKd',
      },
    };

    const result = await ltc.generateTransaction(txData, [kp1]);
    expect(result.txId).toEqual(
      '0219f56b30cb77dd75b720fbe57ed024c9f813241213bb3632b1a2174c39883b',
    );
    expect(result.txHex).toEqual(
      '02000000000101dce0465a0721662196814a7e88d574a4e5ef78760b2b0e55194091399de41789000000001716001413fb3732def26e6d6f36b405812e3686a0e2c3d9fdffffff01e28c2d000000000017a9148201d29cb56db9a1529038f599788d1ecd5d38878702483045022100bfecdb5e5a4c07b1e1ea3683818191f157199016f3e7879dbdbf834789fd820f02206b4677ef0360bc41607fa953d213a00cb365039a2263863c97bb192f81ac968601210203bcea542e8e16830fd5a8cbbf36419aa7b23b723e316081a720966dfb28019000000000',
    );
  });

  it('should generate the transaction to legacy address', async () => {
    const txData = {
      inputs: [utxoOne],
      outputs: {
        to: '3DYRx8E2vK8KaXA9LJ21vV4wGL4hmRYmCL',
        amount: 2985186,
        fee: 200,
        changeAddress: '3Qg4Jb6GJM2vk4eDwiyouPQRAukVa5Mbk7',
      },
    };

    const result = await ltc.generateTransaction(txData, [kp1]);
    expect(result.txId).toEqual(
      '0219f56b30cb77dd75b720fbe57ed024c9f813241213bb3632b1a2174c39883b',
    );
    expect(result.txHex).toEqual(
      '02000000000101dce0465a0721662196814a7e88d574a4e5ef78760b2b0e55194091399de41789000000001716001413fb3732def26e6d6f36b405812e3686a0e2c3d9fdffffff01e28c2d000000000017a9148201d29cb56db9a1529038f599788d1ecd5d38878702483045022100bfecdb5e5a4c07b1e1ea3683818191f157199016f3e7879dbdbf834789fd820f02206b4677ef0360bc41607fa953d213a00cb365039a2263863c97bb192f81ac968601210203bcea542e8e16830fd5a8cbbf36419aa7b23b723e316081a720966dfb28019000000000',
    );
  });
});
