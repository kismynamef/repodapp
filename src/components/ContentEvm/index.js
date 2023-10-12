import {
  encrypt,
  recoverPersonalSignature,
  recoverTypedSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature_v4
} from 'eth-sig-util'
import { get } from 'lodash'
import React, { useState, useEffect, useMemo } from 'react'
import { useConnect } from '../../controller/context/ContextProvider'
import { toChecksumAddress } from 'ethereumjs-util'

import ButtonConnect from '../ButtonConnect'
import ConnectCardBox from '../ConnectCard'
import { ethers } from 'ethers'
import { evmCode } from '../../controller/commons/constant'
import DropdownTab from '../DropdownTab'

const networkData = [
  {
    icon: 'icon-web_ethereum',
    name: 'Ethereum',
    value: '0x1'
  },
  {
    icon: 'icon-web_bsc',
    name: 'Binance Smart Chain',
    value: '0x38'
  },
  {
    icon: 'icon-web_tomo',
    name: 'Tomo Chain',
    value: '0x58'
  },
  {
    icon: 'icon-web_matic',
    name: 'Polygon Chain',
    value: '0x89'
  }
]

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)))
}

function ContentEvm() {
  const [state, setState] = useState({})
  const { client, isExtension, isConnected, connect: onConnect, setIsConnected } = useConnect()
  const [tabIndex, setTabIndex] = useState(networkData[0])

  const onStateUpdate = (field, value) => {
    if (typeof field === 'object') {
      setState((oldState) => {
        const stateUpdate = { ...oldState }

        Object.keys(field).forEach((key) => {
          stateUpdate[key] = field[key]
        })
        return stateUpdate
      })
    } else {
      setState((oldState) => ({ ...oldState, [field]: value }))
    }
  }

  const onSwitchNetwork = (tab) => async () => {
    try {
      if (tab.value === state.chainId || !isConnected) return
      const response = await _provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: tab.value }]
      })
      if (!response) return
      setTabIndex(tab)
    } catch (error) {
      onStateUpdate('ethAccounts', error.toString())
    }
  }

  const _provider = useMemo(() => {
    if (isExtension) {
      return window.ramper2.provider
    }

    return client
  }, [isExtension, client])

  // Functions
  const onEthAccounts = async () => {
    try {
      const response = await _provider.request({
        method: 'eth_accounts'
      })

      onStateUpdate(
        'ethAccounts',
        isExtension ? response : response.error || response.result
      )
    } catch (e) {
      onStateUpdate('ethAccounts', e.toString())
    }
  }

  const onEthSendTransaction = async () => {
    const { ethAccounts: accounts } = state
    try {
      const response = await _provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: accounts[0],
            value: '0x0'
          }
        ]
      })
      console.log(
        '🚀 ~ file: index.js ~ line 68 ~ onEthSendTransaction ~ response',
        response
      )
      onStateUpdate(
        'ethSendTransaction',
        isExtension ? response : response.error || response.result
      )
    } catch (e) {
      onStateUpdate('ethSendTransaction', e.toString())
    }
  }

  const onEthSign = async () => {
    try {
      const msg = 'Coin98 Connect Example Message'

      const response = await _provider.request({
        method: 'eth_sign',
        params: [msg]
      })
      onStateUpdate(
        'ethSign',
        isExtension ? response : response.error || response.result
      )
    } catch (e) {
      onStateUpdate('ethSign', e.toString())
    }
  }

  const onPersonalSign = async () => {
    const { ethAccounts: accounts } = state
    try {
      const exampleMessage = 'Ramper2 Connect Example Message'
      const from = accounts[0]
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
      const response = await _provider.request({
        method: 'personal_sign',
        params: [msg, from]
      })
      console.log("response", response)
      onStateUpdate(
        'personalSign',
        isExtension ? response : response.error || response.result
      )
    } catch (e) {
      onStateUpdate('personalSign', e.toString())
    }
  }

  const onVerifyPersonalSignature = async () => {
    const { ethAccounts: accounts, personalSign } = state
    const exampleMessage = 'Ramper2 Connect Example Message'
    try {
      const from = accounts[0]
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
      let sign
      sign = personalSign
      const recoveredAddr = recoverPersonalSignature({
        data: msg,
        sig: sign
      })
      console.log("recoveredAddr", recoveredAddr)
      console.log("from", from)
      if (recoveredAddr === from) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`)
        sign = recoveredAddr
      } else {
        console.log(
          `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        )
        console.log(`Failed comparing ${recoveredAddr} to ${from}`)
      }

      const ecRecoverAddr = await _provider.request({
        method: 'personal_ecRecover',
        params: [msg, personalSign]
      })

      const resEcRecoverAddr = get(ecRecoverAddr, 'result') || ecRecoverAddr
      console.log('ecRecoverAddr', ecRecoverAddr)
      if (resEcRecoverAddr === from) {
        console.log(`Successfully ecRecovered signer as ${resEcRecoverAddr}`)
        sign = resEcRecoverAddr
      } else {
        console.log(
          `Failed to verify signer when comparing ${resEcRecoverAddr} to ${from}`
        )
      }

      onStateUpdate({
        verifyPersonalSignature: recoveredAddr,
        verifyPersonalSignatureEcRecover: resEcRecoverAddr
      })
    } catch (err) {
      console.error(err)
    }
  }

  const onSignTypedData = async () => {
    const { ethAccounts: accounts } = state

    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!'
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337'
      }
    ]

    try {
      const from = accounts[0]
      const response = await _provider.request({
        method: 'eth_signTypedData',
        params: [isExtension ? msgParams : JSON.stringify(msgParams), from]
      })

      const signTypedDataResult = get(response, 'result') || response

      onStateUpdate(
        'signTypedData',
        isExtension ? signTypedDataResult : response.error || response.result
      )
    } catch (err) {
      console.error(err)
    }
  }

  const onVerifySignTypedData = async () => {
    const { ethAccounts: accounts } = state
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!'
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337'
      }
    ]
    try {
      const from = accounts[0]
      let sign = state.signTypedData
      const recoveredAddr = await recoverTypedSignatureLegacy({
        data: msgParams,
        sig: sign
      })

      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`)
        sign = recoveredAddr
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        )
      }
      // return recoveredAddr

      onStateUpdate('verifySignTypedData', recoveredAddr)
    } catch (error) {
      console.error(error)
    }
  }

  const onSignTypedDataV3 = async () => {
    const { ethAccounts: accounts } = state

    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
        ]
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        contents: 'Hello, Bob!'
      }
    }
    try {
      const from = accounts[0]
      const response = await _provider.request({
        method: 'eth_signTypedData_v3',
        params: [from, JSON.stringify(msgParams)]
      })
      const signTypeDatav3Result = get(response, 'result') || response

      onStateUpdate(
        'signTypedDataV3',
        isExtension ? signTypeDatav3Result : response.error || response.result
      )
    } catch (err) {
      onStateUpdate('signTypedDataV3', err.toString())
    }
  }

  const onVerifySignTypedDataV3 = async () => {
    const { ethAccounts: accounts } = state
    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
        ]
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        contents: 'Hello, Bob!'
      }
    }
    try {
      const from = accounts[0]
      let sign = state.signTypedDataV3
      const recoveredAddr = await recoverTypedSignature({
        data: msgParams,
        sig: sign
      })
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`)
        sign = recoveredAddr
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        )
      }
      onStateUpdate('verifySignTypedDataV3', recoveredAddr)
    } catch (error) {
      console.error(error)
    }
  }

  const onSignTypedDataV4 = async () => {
    const { ethAccounts: accounts } = state
    const chainId = tabIndex.value
    const msgParams = {
      domain: {
        chainId: chainId,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1'
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
          ]
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000'
            ]
          }
        ]
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' }
        ]
      }
    }
    try {
      const from = accounts[0]
      const response = await _provider.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(msgParams)]
      })
      const signTypeDatav3Result = get(response, 'result') || response

      onStateUpdate(
        'signTypedDataV4',
        isExtension ? signTypeDatav3Result : response.error || response.result
      )
    } catch (err) {
      onStateUpdate('signTypedDataV4', err.toString())
    }
  }

  const onVerifySignTypedDataV4 = async () => {
    const { ethAccounts: accounts } = state
    const chainId = tabIndex.value

    const msgParams = {
      domain: {
        chainId: chainId,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1'
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
          ]
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000'
            ]
          }
        ]
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' }
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' }
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' }
        ]
      }
    }
    try {
      const from = accounts[0]
      let sign = state.signTypedDataV4
      const recoveredAddr = recoverTypedSignature_v4({
        data: msgParams,
        sig: sign
      })
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`)
        sign = recoveredAddr
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`
        )
      }
      onStateUpdate('verifySignTypedDataV4', recoveredAddr)
    } catch (error) {
      onStateUpdate('verifySignTypedDataV4', error.toString())
    }
  }

  const onEthGetPublicEncryptionKey = async () => {
    const { ethAccounts: accounts } = state
    try {
      const response = await _provider.request({
        method: 'eth_getEncryptionPublicKey',
        params: [accounts[0]]
      })
      console.log('getEncryptionKey', response)
      onStateUpdate(
        'ethPublicEncryptionKey',
        isExtension ? response : response.error || response.result
      )
    } catch (error) {
      onStateUpdate('ethPublicEncryptionKey', error.toString())
    }
  }

  const onEncrypt = async () => {
    try {
      const response = stringifiableToHex(
        encrypt(
          state.ethPublicEncryptionKey,
          { data: '123123' },
          'x25519-xsalsa20-poly1305'
        )
      )
      onStateUpdate('encrypt', response)
    } catch (error) {
      onStateUpdate('encrypt', error.toString())
    }
  }

  const onDecrypt = async () => {
    const { ethAccounts: accounts } = state
    try {
      const response = await _provider.request({
        method: 'eth_decrypt',
        params: [state.encrypt, accounts[0]]
      })
      onStateUpdate('decrypt', response)
    } catch (error) {
      onStateUpdate('decrypt', error.toString())
    }
  }

  const onInitState = async () => {
    if (!isExtension) return false
    const getChainId = _provider.request({ method: 'eth_chainId' })
    const getNetVersion = _provider.request({ method: 'net_version' })
    const getAccounts = _provider.request({ method: 'eth_accounts' })

    const [chainId, netVersion, accounts] = await Promise.all([
      getChainId,
      getNetVersion,
      getAccounts
    ])
    console.log({ chainId, netVersion, accounts })
    const activeNetwork = networkData.find(res => res.value === chainId)
    if (activeNetwork) setTabIndex(activeNetwork)
    onStateUpdate({
      chainId: chainId, // temp
      netVersion: netVersion, // temp
      accounts
    })
  }
  const onChangeWallet = async () => {
    await _provider.on('accountsChanged', handleAccountsChanged)

  }
  const handleAccountsChanged = (accounts) => {
    // Handle new accounts, or lack thereof.
    const account = accounts[0]
    if (account) {
      console.log("leu leu do cho")
      onStateUpdate('ethAccounts', accounts)
      return onInitState()
    }
    if (!account) {
      console.log("leu leu do ngu")
      setIsConnected(false)
      setState({})
    }
  }
  // funtions handle
  const handleOpenModal = (content, onClickModal, isDisableRunCode) => () => {
    window.openModal({
      content,
      onClickModal,
      isDisableRunCode
    })
  }

  useEffect(() => {
    if (isConnected) {
      onInitState()
      onChangeWallet()
    }
  }, [isConnected, tabIndex])

  const isDisableAction =
    !isConnected || (!state.ethAccounts && !state.accounts)
  const chainId = state.chainId
  const netVersion = state.netVersion
  const walletAddress =
    get(state, 'accounts[0]') || get(state, 'ethAccounts[0]')

  return (
    <>
      {isConnected && (
        <div className="flex items-start flex-col lg:flex-row lg:items-end mb-4">
          <div>
            {chainId === '0x1' && (
              <div className="px-5 py-3 mb-4 bg-[#cd6a6580] text-white text-[13px] rounded-[32px] border-[1px] border-redb9423c mr-4">
                <span className="text-white">
                  You are on the Ethereum Mainnet.
                </span>
              </div>
            )}

            {chainId && (
              <div className="px-5 py-3 mb-4 lg:mb-0 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] mr-4">
                <span className="text-[#d9b432]">Chain ID</span> {chainId}
              </div>
            )}
          </div>

          {netVersion && (
            <div className="px-5 py-3 mb-4 lg:mb-0 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] mr-4">
              <span className="text-[#d9b432]">Network</span> {netVersion}
            </div>
          )}

          {walletAddress && (
            <div className="w-full sm:w-[auto] px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] break-words">
              <span className="text-[#d9b432]">Account</span> {walletAddress}
            </div>
          )}
        </div>
      )}
      <div className="masonry sm:masonry-sm md:masonry-md">
        {/* connect actions */}
        <ConnectCardBox title="Ramper has installed">
          <ButtonConnect
            isDisable={true}
            titleBtn={isExtension ? 'True' : 'Please Install Ramper to connect dapp'}
            onClickShowCode={handleOpenModal(
              evmCode.checkConnect,
              onConnect,
              isConnected
            )}
          />
        </ConnectCardBox>
        <ConnectCardBox title="Basic actions">
          <ButtonConnect
            isDisable={isConnected}
            onClick={onConnect}
            titleBtn={isConnected ? 'Connected' : 'Connect'}
            onClickShowCode={handleOpenModal(
              evmCode.connect,
              onConnect,
              isConnected
            )}
          />

          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="ETH_Accounts"
            onClick={onEthAccounts}
            isNoSpace
            resultTitle="eth_accounts result"
            result={state.ethAccounts}
            onClickShowCode={handleOpenModal(
              evmCode.getAccount,
              onEthAccounts,
              isDisableAction
            )}
          />
        </ConnectCardBox>
        {/* switch network */}
        <DropdownTab arrData={networkData} itemChoose={tabIndex} onChoose={onSwitchNetwork} />

        {/* personal sign */}
        <ConnectCardBox title="Personal Sign">
          <ButtonConnect
            titleBtn="Sign"
            onClick={onPersonalSign}
            isDisable={isDisableAction}
            resultTitle="Result"
            result={state.personalSign}
            onClickShowCode={handleOpenModal(
              evmCode.personalSign,
              onPersonalSign,
              isDisableAction
            )}
          />

          <ButtonConnect
            isDisable={!state.personalSign}
            titleBtn="Verify"
            onClick={onVerifyPersonalSignature}
            isNoSpace
            // resultTitle="verify personal signature result"
            // result={state.verifyPersonalSignature}
            resultArr={
              state.verifyPersonalSignature &&
              state.verifyPersonalSignatureEcRecover && [
                {
                  title: 'eth-sig-util recovery result',
                  result: state.verifyPersonalSignature
                },
                {
                  title: 'personal_ecRecover result',
                  result: state.verifyPersonalSignatureEcRecover
                }
              ]
            }
            onClickShowCode={handleOpenModal(
              evmCode.personalVerify,
              onVerifyPersonalSignature,
              !state.personalSign
            )}
          />
        </ConnectCardBox>

        {/* sign data type */}
        <ConnectCardBox title="Sign Typed Data">
          <ButtonConnect
            titleBtn="Sign"
            onClick={onSignTypedData}
            isDisable={isDisableAction}
            resultTitle="Result"
            result={state.signTypedData}
            onClickShowCode={handleOpenModal(
              evmCode.signTypedData,
              onSignTypedData,
              isDisableAction
            )}
          />
          <ButtonConnect
            titleBtn="Verify"
            onClick={onVerifySignTypedData}
            isDisable={!state.signTypedData}
            isNoSpace
            resultTitle="Recovery result"
            result={state.verifySignTypedData}
            onClickShowCode={handleOpenModal(
              evmCode.signTypedDataVerify,
              onVerifySignTypedData,
              !state.signTypedData
            )}
          />
        </ConnectCardBox>

        {/* Send Txs */}
        <ConnectCardBox title="Send ETH">
          <ButtonConnect
            isDisable={isDisableAction}
            titleBtn="Send"
            onClick={onEthSendTransaction}
            isNoSpace
            resultTitle="result"
            result={state.ethSendTransaction}
            onClickShowCode={handleOpenModal(
              evmCode.sendEth,
              onEthSendTransaction,
              isDisableAction
            )}
          />
        </ConnectCardBox>

        {/* Sign */}
        <ConnectCardBox title="Eth Sign">
          <ButtonConnect
            isDisable={isDisableAction}
            titleBtn="Sign"
            onClick={onEthSign}
            isNoSpace
            resultTitle="eth_sign result"
            result={state.ethSign}
            onClickShowCode={handleOpenModal(
              evmCode.ethSign,
              onEthSign,
              isDisableAction
            )}
          />
        </ConnectCardBox>

        {/* sign data type v3 */}
        <ConnectCardBox title="Sign Typed Data V3">
          <ButtonConnect
            titleBtn="Sign"
            onClick={onSignTypedDataV3}
            isDisable={isDisableAction}
            resultTitle="eth_accounts result"
            result={state.signTypedDataV3}
            onClickShowCode={handleOpenModal(
              evmCode.onSignTypedDataV3,
              onSignTypedDataV3,
              isDisableAction
            )}
          />

          <ButtonConnect
            titleBtn="Verify"
            onClick={onVerifySignTypedDataV3}
            isDisable={!state.signTypedDataV3}
            isNoSpace
            resultTitle="eth_accounts result"
            result={state.verifySignTypedDataV3}
            onClickShowCode={handleOpenModal(
              evmCode.signTypedDataV3Verify,
              onVerifySignTypedDataV3,
              !state.signTypedDataV3
            )}
          />
        </ConnectCardBox>

        {/* sign data type v4 */}
        <ConnectCardBox title="Sign Typed Data V4">
          <ButtonConnect
            titleBtn="Sign"
            onClick={onSignTypedDataV4}
            isDisable={isDisableAction}
            resultTitle="eth_signTypedDataV4 result"
            result={state.signTypedDataV4}
            onClickShowCode={handleOpenModal(
              evmCode.onSignTypedDataV4,
              onSignTypedDataV4,
              isDisableAction
            )}
          />

          <ButtonConnect
            titleBtn="Verify"
            onClick={onVerifySignTypedDataV4}
            isDisable={!state.signTypedDataV4}
            isNoSpace
            resultTitle="verify result"
            result={state.verifySignTypedDataV4}
            onClickShowCode={handleOpenModal(
              evmCode.signTypedDataV4Verify,
              onVerifySignTypedDataV4,
              !state.signTypedDataV4
            )}
          />
        </ConnectCardBox>

        {/* encrypt/decrypt */}
        <ConnectCardBox title="Encrypt/ Decrypt" className="hidden md:block">
          <ButtonConnect
            titleBtn="Get Public Encryption Key"
            onClick={onEthGetPublicEncryptionKey}
            isDisable={isDisableAction}
            resultTitle="Encryption key"
            result={state.ethPublicEncryptionKey}
            onClickShowCode={handleOpenModal(
              evmCode.getEncryptKey,
              onEthGetPublicEncryptionKey,
              isDisableAction
            )}
          />

          <ButtonConnect
            titleBtn="Encrypt"
            onClick={onEncrypt}
            isDisable={!state.ethPublicEncryptionKey}
            resultTitle="Ciphertext"
            result={state.encrypt}
            isOveflowHiddenText
            onClickShowCode={handleOpenModal(
              evmCode.getEncrypt,
              onEncrypt,
              !state.ethPublicEncryptionKey
            )}
          />

          <ButtonConnect
            titleBtn="Decrypt"
            onClick={onDecrypt}
            isNoSpace
            isDisable={!state.ethPublicEncryptionKey}
            resultTitle="Cleartext"
            result={state.decrypt}
            onClickShowCode={handleOpenModal(
              evmCode.getDecrypt,
              onDecrypt,
              !state.ethPublicEncryptionKey
            )}
          />
        </ConnectCardBox>
      </div>
    </>
  )
}

export default ContentEvm
