import React, { useEffect, useMemo } from 'react'
import ConnectCardBox from '../ConnectCard'
import ButtonConnect from '../ButtonConnect'
import { cosmosCode } from '../../controller/commons/constant'
import { makeSignDoc } from '@cosmjs/launchpad'
import { useConnect } from '../../controller/context/ContextProvider'
import useStateCustom from '../../hooks/useStateCustom'
import bs58 from 'bs58'
// const Tx = require('@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx')
import { get } from 'lodash'

const chainId = 'pacific-1'

function ContentCosmos() {
  const { client, isExtension, isConnected, connect: onConnect } = useConnect()

  const [state, setState] = useStateCustom()

  const _provider = useMemo(() => {
    if (isExtension) {
      return window.ramper2.cosmos
    }

    return client
  }, [])
  // connect actions
  const handleConnect = async () => {
    onCosmosAccount()
  }

  const onCosmosAccount = async () => {
    try {
      const response = await _provider.enable(chainId)
      setState('cosmosGetKey', response)
    } catch (e) {}
  }

  const handleGetKeyCosmos = async () => {
    if (isExtension) {
      const accounts = await _provider.getKey(chainId)
      setState('cosmosGetKey', accounts)
    } else {
      const accounts = await _provider.request({
        method: 'enable',
        params: [chainId]
      })
      setState('cosmosGetKey', accounts)
    }
  }

  // send eth action
  const handleGetCosmosSignAmino = async () => {
    const msgs = [
      {
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: [
            {
              amount: 10000,
              denom: 'uatom'
            }
          ],
          from_address: 'cosmos1n4aqj7lucydfdfmml7kvw2lecld99ere2lagwd',
          to_address: 'cosmos1n4aqj7lucydfdfmml7kvw2lecld99ere2lagwd'
        }
      }
    ]

    const fee = {
      amount: [{ amount: '2000', denom: 'uatom' }],
      gas: '80000'
    }
    const aDocToSign = makeSignDoc(
      msgs,
      fee,
      'cosmoshub-4',
      'Some Memo',
      '71079',
      '157'
    )

    if (isExtension) {
      const response = await _provider.signAmino(
        'cosmoshub-4',
        'cosmos1n4aqj7lucydfdfmml7kvw2lecld99ere2lagwd',
        aDocToSign
      )
      setState('cosmosSignAmino', response)
    } else {
      const response = await _provider.request({
        method: 'cosmos_signAmino',
        params: [
          {
            chainId,
            signer: 'cosmos1n4aqj7lucydfdfmml7kvw2lecld99ere2lagwd',
            signDoc: aDocToSign
          }
        ]
      })
      setState(
        'cosmosSignAmino',
        JSON.stringify(response.error || response.result)
      )
    }
  }

  const handleGetSignDirect = async () => {
    //
    const signDoc = {
      bodyBytes: bs58.decode(
        '8UNtVMXnMNvTxbtwixn83qXUKKTbAYXgftyqyJ9usXUKGxETvW1LfE9BQQ9s4q6bdvPRsHfyLpEHA1C86zuUkBnfEpLdHaXLJFi75yFfxgQjTWHiHUxFbWGeZWzvSj74BHiHvf1vjv279iPTL4845rHBctpEe63XqaeHKom9r9XsQsB4zWQ8HsLN9BAB4d8Qn1omtWqZwvP8J4BGBf9BBYN7g8cbABmkShpRuxUHFXwa8koVYgRCUpTvA6UQDq9eYAMBe7Wn59yBej6RczaFY1Jdoz7HrGdCjrzP5h5EqNfnzGh5BRg5vR2UQCVRV8ZGya7CwPVawiD7eFsXQnN1kDM3gsMnEvmfGwBhfrBK2TJzYtfPdMWfstdd9T4bMr7P9jkaXaMBfJo9qZfhpudZnFxXwQyCLNmRQzVqNKze4XqQR4GiVH'
      ),
      authInfoBytes: bs58.decode(
        'QFGW6W8idWdMWnL3cgGRnKQYop4Z7je6kwJd3ZLaS4o9D8SahfXdo183S5cn2HzE4HaHhfZX3SfXb8K77r43KgLBooesUv2W7vcGATUPpiNJVtScwHKPEDepgk4G5kN3nLMzmaKh'
      ),
      chainId: 'serenity-testnet-001',
      accountNumber: {
        low: 47,
        high: 0,
        unsigned: false
      }
    }

    console.log(
      '🚀 ~ file: index.js ~ line 106 ~ handleGetSignDirect ~ signDoc',
      signDoc
    )

    if (isExtension) {
      return
    }

    const response = await _provider.request({
      method: 'cosmos_signDirect',
      params: [
        {
          chainId,
          signer: state.getCosmosKey?.bech32Address,
          signDoc
        }
      ]
    })
    console.log(
      '🚀 ~ file: index.js ~ line 117 ~ handleGetSignDirect ~ response',
      response
    )
  }

  const handleCosmosSuggestChain = async () => {
    const chainData = {
      features: ['no-legacy-stdTx'],
      chainId: 'aura-testnet',
      chainName: 'aura testnet',
      rpc: 'https://tendermint-testnet.aura.network',
      rest: 'https://rpc-testnet.aura.network',
      explorer: 'https://explorer.test.aura.network',
      bip44: {
        coinType: 118
      },
      bech32Config: {
        bech32PrefixAccAddr: 'aura',
        bech32PrefixAccPub: 'aura' + 'pub',
        bech32PrefixValAddr: 'aura' + 'valoper',
        bech32PrefixValPub: 'aura' + 'valoperpub',
        bech32PrefixConsAddr: 'aura' + 'valcons',
        bech32PrefixConsPub: 'aura' + 'valconspub'
      },
      currencies: [
        {
          coinDenom: 'AURA',
          coinMinimalDenom: 'uaura',
          coinDecimals: 6
          // coinGeckoId: "aura",
        }
      ],
      feeCurrencies: [
        {
          coinDenom: 'AURA',
          coinMinimalDenom: 'uaura',
          coinDecimals: 6
          // coinGeckoId: "uaura",
        }
      ],
      stakeCurrency: {
        coinDenom: 'AURA',
        coinMinimalDenom: 'uaura',
        coinDecimals: 6
        // coinGeckoId: "uaura",
      },
      coinType: 118,
      gasPriceStep: {
        low: 1,
        average: 2.5,
        high: 4
      },
      walletUrlForStaking: 'https://stake.aura.network',
      logo: 'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F3402132828-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fcollections%252F3dQne9qVWEQFwmp9i1C4%252Ficon%252FCsd3tA75dQDYsIQICEDB%252FCoin98-07.png%3Falt%3Dmedia%26token%3Dddda47aa-350d-4fcc-adf3-25c7c92a8a51'
    }

    try {
      if (isExtension) {
        // Void
        _provider.experimentalSuggestChain(chainData)
      } else {
        // Void
        _provider.request({
          method: 'cosmos_experimentalSuggestChain',
          params: [chainData]
        })
      }
    } catch (e) {
      // Some error return here
      console.log(e.toString())
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
      onCosmosAccount()
    }
  }, [isConnected])

  const address = get(state, 'cosmosGetKey.bech32Address', '')

  return (
    <>
      {isConnected && (
        <div className="flex items-start flex-col lg:flex-row lg:items-end mb-4">
          {chainId && (
            <div className="px-5 py-3 mb-4 lg:mb-0 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] mr-4">
              <span className="text-[#d9b432]">Chain ID</span> {chainId}
            </div>
          )}
          <div>
            {address && (
              <div className="w-full sm:w-[auto] px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] break-words">
                <span className="text-[#d9b432]">Account</span> {address}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="masonry sm:masonry-sm md:masonry-md">
        {/* connect actions */}
        <ConnectCardBox title="basic actions">
          <ButtonConnect
            isDisable={isConnected}
            titleBtn={isConnected ? 'Connected' : 'Connect'}
            onClick={handleConnect}
            isHideShowCode
          />

          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="Cosmos Key"
            onClick={handleGetKeyCosmos}
            onClickShowCode={handleOpenModal(
              cosmosCode.getCosmosKey,
              handleGetKeyCosmos,
              !isConnected
            )}
            isNoSpace
            resultTitle="Cosmos Account Result"
            result={state.cosmosGetKey}
          />
        </ConnectCardBox>

        {/* cosmos amino */}
        <ConnectCardBox title="Sign Amino">
          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="Sign Amimo"
            onClick={handleGetCosmosSignAmino}
            onClickShowCode={handleOpenModal(
              cosmosCode.cosmosSignAmino,
              handleGetCosmosSignAmino,
              !isConnected
            )}
            isNoSpace
            resultTitle="Sign Amimo Result"
            result={state.cosmosSignAmino}
          />
        </ConnectCardBox>

        <ConnectCardBox title="Sign Direct">
          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="Sign Direct"
            onClick={handleGetSignDirect}
            onClickShowCode={handleOpenModal(
              cosmosCode.cosmosSignDirect,
              handleGetSignDirect,
              !isConnected
            )}
            isNoSpace
            resultTitle="Sign Direct Result"
            // result={state.nearAccount && state.nearAccount}
          />
        </ConnectCardBox>

        <ConnectCardBox title="Suggest Chain">
          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="Suggest Chain"
            onClick={handleCosmosSuggestChain}
            onClickShowCode={handleOpenModal(
              cosmosCode.cosmosSuggestChain,
              handleCosmosSuggestChain,
              !isConnected
            )}
            isNoSpace
            resultTitle="Suggest Chain Result"
          />
        </ConnectCardBox>
      </div>
    </>
  )
}

export default ContentCosmos
