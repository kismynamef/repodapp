import { Buffer } from 'buffer';
import {
  encrypt,
  recoverPersonalSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature,
  recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';
import { toChecksumAddress } from 'ethereumjs-util';
import { ethers } from 'ethers';
import get from 'lodash/get';
import { useConnect } from '../context/ContextProvider';

let encryptionKey;
let encryptResult;
let personalSignData;
let signTypedDataResult;
let signTypeDatav3Result;
let signTypeDatav4Result;

const useEvmConnect = () => {
  const { sdk, state, setState } = useConnect();

  const { accounts } = state;
  const isWindow = typeof window !== 'undefined';
  const ethereum = isWindow && (sdk || window.ramper2?.provider);

  function stringifiableToHex(value) {
    return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      });
      console.log('newAccounts ok gege', newAccounts);

      setState({ accounts: newAccounts });
      // setAccounts(newAccounts)
      return newAccounts;
    } catch (error) {
      console.error('err connect', error);
    }
  };

  const getAccountsButton = async () => {
    try {
      const _accounts = await ethereum.request({
        method: 'eth_accounts',
      });
      if (sdk) {
        // replace for onClickConnect
        const sdkAccounts = get(_accounts, 'result');
        setState({ accounts: sdkAccounts });
        console.log('accounts sdk', accounts);
      }
      return sdk ? get(_accounts, 'result') : _accounts;
    } catch (err) {
      console.error(err);
    }
  };

  const sendLegacy = async () => {
    console.log('senLegacy accs', accounts);
    try {
      const result = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: accounts[0],
            value: '0x0',
            gasLimit: '0x5028',
            gasPrice: '0x2540be400',
            type: '0x0',
          },
        ],
      });
      console.log('resultSend', result);
      return result;
    } catch (err) {
      console.log({ err });
    }
  };

  const getEncryptionKey = async () => {
    try {
      const result = await ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]],
      });
      console.log('getEncryptionKey', result);
      encryptionKey = result;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const encryptButton = (value) => {
    try {
      const result = stringifiableToHex(
        encrypt(encryptionKey, { data: value }, 'x25519-xsalsa20-poly1305')
      );
      encryptResult = result;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const decryptButton = async () => {
    try {
      const result = await ethereum.request({
        method: 'eth_decrypt',
        params: [encryptResult, ethereum.selectedAddress],
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const ethSign = async () => {
    console.log('accounts[0]', accounts);

    try {
      const msg =
        '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ethResult = await ethereum.request({
        method: 'eth_sign',
        params: [accounts[0], msg],
      });
      console.log('ethResult', ethResult);
      return get(ethResult, 'result') || ethResult;
    } catch (err) {
      console.error(err);
    }
  };

  const personalSign = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      personalSignData = get(sign, 'result') || sign;
      return get(sign, 'result') || sign;
    } catch (err) {
      console.error(err);
    }
  };

  const personalSignVerify = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      let sign;
      sign = personalSignData;
      console.log('sign', sign);
      const recoveredAddr = recoverPersonalSignature({
        data: msg,
        sig: sign,
      });
      if (recoveredAddr === from) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
        sign = recoveredAddr;
      } else {
        console.log(
          `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        );
        console.log(`Failed comparing ${recoveredAddr} to ${from}`);
      }
      const ecRecoverAddr = await ethereum.request({
        method: 'personal_ecRecover',
        params: [msg, personalSignData],
      });

      const resEcRecoverAddr = get(ecRecoverAddr, 'result') || ecRecoverAddr;
      console.log('ecRecoverAddr', ecRecoverAddr);
      if (resEcRecoverAddr === from) {
        console.log(`Successfully ecRecovered signer as ${resEcRecoverAddr}`);
        sign = resEcRecoverAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${resEcRecoverAddr} to ${from}`
        );
      }

      return {
        ethSign: recoveredAddr,
        ecRecover: resEcRecoverAddr,
      };
    } catch (err) {
      console.error(err);
    }
  };

  const signTypedData = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];

    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData',
        params: [isWindow ? msgParams : JSON.stringify(msgParams), from],
      });

      signTypedDataResult = get(sign, 'result') || sign;
      return get(sign, 'result') || sign;
    } catch (err) {
      console.error(err);
    }
  };

  const signTypedDataVerify = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];
    try {
      const from = accounts[0];
      let sign = signTypedDataResult;
      const recoveredAddr = await recoverTypedSignatureLegacy({
        data: msgParams,
        sig: sign,
      });
      console.log('recoveredAddr', recoveredAddr);

      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        sign = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        );
      }
      return recoveredAddr;
    } catch (error) {
      console.error(error);
    }
  };

  const signTypedDataV3 = async (network, chain) => {
    const networkId = parseInt(network, 10);
    const chainId = parseInt(chain, 16) || networkId;

    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };
    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData_v3',
        params: [from, JSON.stringify(msgParams)],
      });
      signTypeDatav3Result = get(sign, 'result') || sign;
      return get(sign, 'result') || sign;
    } catch (err) {
      console.error(err);
    }
  };

  const signTypedDataV3Verify = async (network, chain) => {
    const networkId = parseInt(network, 10);
    const chainId = parseInt(chain, 16) || networkId;

    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };
    try {
      const from = accounts[0];
      let sign = signTypeDatav3Result;
      const recoveredAddr = await recoverTypedSignature({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        sign = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        );
      }
      return recoveredAddr;
    } catch (error) {
      console.error(error);
    }
  };

  const signTypedDataV4 = async (network, chain) => {
    const networkId = parseInt(network, 10);
    const chainId = parseInt(chain, 16) || networkId;
    const msgParams = {
      domain: {
        chainId: chainId.toString(),
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };
    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(msgParams)],
      });
      signTypeDatav4Result = get(sign, 'result') || sign;
      return get(sign, 'result') || sign;
    } catch (err) {
      console.error(err);
    }
  };

  const signTypedDataV4Verify = async (network, chain) => {
    const networkId = parseInt(network, 10);
    const chainId = parseInt(chain, 16) || networkId;
    const msgParams = {
      domain: {
        chainId,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };
    try {
      const from = accounts[0];
      let sign = signTypeDatav4Result;
      const recoveredAddr = recoverTypedSignatureV4({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        sign = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        );
      }
      return recoveredAddr;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    decryptButton,
    encryptButton,
    ethSign,
    getAccountsButton,
    getEncryptionKey,
    onClickConnect,
    personalSign,
    personalSignVerify,
    sendLegacy,
    signTypedData,
    signTypedDataV3,
    signTypedDataV3Verify,
    signTypedDataV4,
    signTypedDataV4Verify,
    signTypedDataVerify,
  };
};

export default useEvmConnect;
