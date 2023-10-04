
import { coins, makeSignDoc } from '@cosmjs/launchpad'
import base58 from 'base58'
import { get } from 'lodash'
import { useState } from 'react'

const isWindow = typeof window !== 'undefined'

const chainId = 'cosmos'

const useCosmosConnect = (sdk) => {
  const isExtension = window.ramper2?.keplr
  const cosmos = isWindow && (sdk || window.ramper2?.keplr)
  const [cosmosKey, setCosmosKey] = useState()

  const getCosmosKey = async () => {
    try {
      let result

      if (isExtension) {
        result = cosmos.getKey('cosmoshub-4')
      } else {
        result = await cosmos.request({
          method: 'cosmos_getKey',
          params: [chainId] // Currently only accept 1 chain
        })
      }

      setCosmosKey(result)
      return result || {}
    } catch (e) {
    }
  }

  const getSignDoc = async () => {
    const signer = cosmosKey?.bech32Address
    const msg = {
      type: 'cosmos-sdk/MsgSend',
      value: {
        from_address: signer,
        to_address: signer,
        amount: [{
          denom: 'uatom',
          amount: 10000
        }]

      }
    }

    return makeSignDoc([msg], {
      amount: coins(10000, 'uatom'),
      gas: '400000'
    }, 'cosmos', '123123123', '12312312', '1231231')
  }

  const cosmosSignAmino = async () => {
    // Sign Send Msg
    try {
      const signDoc = await getSignDoc()
      const signer = cosmosKey?.bech32Address

      const result = await cosmos.signAmino(chainId, signer, signDoc)

      return result
    } catch (e) {
    }
  }

  const cosmosSignDirect = async () => {
    const signDoc = {
      bodyBytes: base58.decode('8UNtVMXnMNvTxbtwixn83qXUKKTbAYXgftyqyJ9usXUKGxETvW1LfE9BQQ9s4q6bdvPRsHfyLpEHA1C86zuUkBnfEpLdHaXLJFi75yFfxgQjTWHiHUxFbWGeZWzvSj74BHiHvf1vjv279iPTL4845rHBctpEe63XqaeHKom9r9XsQsB4zWQ8HsLN9BAB4d8Qn1omtWqZwvP8J4BGBf9BBYN7g8cbABmkShpRuxUHFXwa8koVYgRCUpTvA6UQDq9eYAMBe7Wn59yBej6RczaFY1Jdoz7HrGdCjrzP5h5EqNfnzGh5BRg5vR2UQCVRV8ZGya7CwPVawiD7eFsXQnN1kDM3gsMnEvmfGwBhfrBK2TJzYtfPdMWfstdd9T4bMr7P9jkaXaMBfJo9qZfhpudZnFxXwQyCLNmRQzVqNKze4XqQR4GiVH'),
      authInfoBytes: base58.decode('QFGW6W8idWdMWnL3cgGRnKQYop4Z7je6kwJd3ZLaS4o9D8SahfXdo183S5cn2HzE4HaHhfZX3SfXb8K77r43KgLBooesUv2W7vcGATUPpiNJVtSSKRyE8mpG7ppSv6NZdvbLUjdR'),
      chainId,
      accountNumber: {
        low: 47,
        hihgh: 0,
        unsigned: false
      }
    }

    try {
      const result = await cosmos.request({
        method: 'cosmos_signDirect',
        params: [{
          chainId, signer: cosmosKey?.bech32Address, signDoc, origin
        }]
      })
      return get(result, 'result') || result
    } catch (e) {
    }
  }

  const cosmosSuggestChain = async () => {
    try {
      const result = cosmos.request({
        method: 'cosmos_experimentalSuggestChain',
        params: [
          {
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
        ]
      })

      return get(result, 'result') || result
    } catch (e) {
    }
  }

  return {
    getCosmosKey,
    cosmosSignAmino,
    cosmosSignDirect,
    cosmosSuggestChain
  }
}

export default useCosmosConnect
