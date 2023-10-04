const evmCode = {
  checkConnect: `const onCheckInstalled = async () => {
    try {
      return !!window.ramper2
    } catch (error) {
      console.error('err check install', error)
    }
  }`,
  connect: `const onClickConnect = async () => {
  try {
    const accounts = await window.ramper2.provider.request({
      method: 'eth_requestAccounts'
    })
    return accounts
  } catch (error) {
    console.error('err connect', error)
  }
}`,

  getAccount: `const onEthAccounts = async () => {
  try {
    const response = await _provider.request({
      method: 'eth_accounts'
    })
    return _accounts
  } catch (err) {
    console.error({ err })
  }
}`,

  sendEth: `const onEthSendTransaction = async () => {
  try {
    const result = await window.ramper2.provider.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: <Your Account>,
          to: <Your Account>,
          value: '0x0'
        }
      ]
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  getEncryptKey: `const onEthGetPublicEncryptionKey = async () => {
  try {
    const result = await window.ramper2.provider.request({
      method: 'eth_getEncryptionPublicKey',
      params: [<Your Account>]
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  getEncrypt: `const onEncrypt = () => {
  try {
    const result = stringifiableToHex(
      encrypt(
        encryptionKeyResult,
        { data: '123123' },
        'x25519-xsalsa20-poly1305'
      )
    )
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  getDecrypt: `const onDecrypt = async () => {
  try {
    const result = await window.ramper2.provider.request({
      method: 'eth_decrypt',
      params: [encryptResult, ethereum.selectedAddress]
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  ethSign: `const onEthSign = async () => {
  try {
    const msg = 'Coin98 Connect Example Message'

    const result = await window.ramper2.provider.request({
      method: 'eth_sign',
      params: [msg]
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  personalSign: `const onPersonalSign = async () => {
    const exampleMessage = 'Coin98 Connect Example Message'

    try {
    const from = <Your Account>
    const msg = \`0x\${Buffer.from(exampleMessage, 'utf8').toString('hex')}\`
    const sign = await window.ramper2.provider.request({
      method: 'personal_sign',
      params: [msg, from, 'Example password']
    })
    return sign
  } catch (err) {
    console.log({ err })
  }
}`,

  personalVerify: `const onVerifyPersonalSignature = async () => {
  const exampleMessage = 'Coin98 Connect Example Message'

  try {
    const from = <Your Account>
    const msg = \`0x\${Buffer.from(exampleMessage, 'utf8').toString('hex')}\`
    let sign
    sign = personalSignResult
    const recoveredAddr = recoverPersonalSignature({
      data: msg,
      sig: sign
    })

    if (recoveredAddr === from) {
      console.log(\`SigUtil Successfully verified signer as \${recoveredAddr}\`)
      sign = recoveredAddr
    } else {
      console.log(
        \`SigUtil Failed to verify signer when comparing \${recoveredAddr} to \${from}\`
      )
      console.log(\`Failed comparing \${recoveredAddr} to \${from}\`)
    }

    const ecRecoverAddr = await window.ramper2.provider.request({
      method: 'personal_ecRecover',
      params: [msg, personalSignResult]
    })

    if (ecRecoverAddr === from) {
      console.log(\`Successfully ecRecovered signer as \${ecRecoverAddr}\`)
      sign = ecRecoverAddr
    } else {
      console.log(
        \`Failed to verify signer when comparing \${ecRecoverAddr} to \${from}\`
      )
    }

    return {
      ethSign: recoveredAddr,
      ecRecover: ecRecoverAddr
    }
  } catch (err) {
    console.log({ err })
  }
}`,

  signTypedData: `const onSignTypedData = async () => {
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
    const from = <Your Account>
    const sign = await window.ramper2.provider.request({
      method: 'eth_signTypedData',
      params: [msgParams, from]
    })

    return sign
  } catch (err) {
    console.log({ err })
  }
}`,

  signTypedDataVerify: `const onVerifySignTypedData = async () => {
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
    const from = <Your Account>
    let sign = signTypedDataResult
    const recoveredAddr = await recoverTypedSignatureLegacy({
      data: msgParams,
      sig: sign
    })
    if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
      console.log(\`Successfully verified signer as \${recoveredAddr}\`)
      sign = recoveredAddr
    } else {
      console.log(
        \`Failed to verify signer when comparing \${recoveredAddr} to \${from}\`
      )
    }
    return recoveredAddr
  } catch (err) {
    console.log({ err })
  }
}`,

  onSignTypedDataV3: `const onSignTypedDataV3 = async () => {
  const networkId = parseInt(window.ramper2.provider.networkVersion, 10)
  const chainId = parseInt(window.ramper2.provider.chainId, 16) || networkId

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
    const from = <Your Account>
    const sign = await window.ramper2.provider.request({
      method: 'eth_signTypedData_v3',
      params: [from, JSON.stringify(msgParams)]
    })
    return sign
  } catch (err) {
    console.log({ err })
  }
}`,

  signTypedDataV3Verify: `const onVerifySignTypedDataV3 = async () => {
  const networkId = parseInt(window.ramper2.provider.networkVersion, 10)
  const chainId = parseInt(window.ramper2.provider.chainId, 16) || networkId

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
    const from = <Your Account>
    let sign = signTypeDatav3Result
    const recoveredAddr = await recoverTypedSignature({
      data: msgParams,
      sig: sign
    })
    if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
      console.log(\`Successfully verified signer as \${recoveredAddr}\`)
      sign = recoveredAddr
    } else {
      console.log(
        \`Failed to verify signer when comparing \${recoveredAddr} to \${from}\`
      )
    }
    return recoveredAddr
  } catch (err) {
    console.log({ err })
  }
}`,

  onSignTypedDataV4: `const onSignTypedDataV4 = async () => {
  const networkId = parseInt(window.ramper2.provider.networkVersion, 10)
  const chainId = parseInt(window.ramper2.provider.chainId, 16) || networkId

  const msgParams = {
    domain: {
      chainId: chainId.toString(),
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
    const from = <Your Account>
    const sign = await window.ramper2.provider.request({
      method: 'eth_signTypedData_v4',
      params: [from, JSON.stringify(msgParams)]
    })
    return sign
  } catch (err) {
    console.log({ err })
  }
}`,

  signTypedDataV4Verify: `const onVerifySignTypedDataV4 = async () => {
  const networkId = parseInt(window.ramper2.provider.networkVersion, 10)
  const chainId = parseInt(window.ramper2.provider.chainId, 16) || networkId

  const msgParams = {
    domain: {
      chainId,
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
    const from = <Your Account>
    let sign = signTypeDatav4Result
    const recoveredAddr = recoverTypedSignatureV4({
      data: msgParams,
      sig: sign
    })
    if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
      console.log(\`Successfully verified signer as \${recoveredAddr}\`)
      sign = recoveredAddr
    } else {
      console.log(
        \`Failed to verify signer when comparing \${recoveredAddr} to \${from}\`
      )
    }
    return recoveredAddr
  } catch (err) {
    console.log(err)
  }
}`
}

const solanaCode = {
  solAccounts: `const onSolAccount = async () => {
  try {
    const result = await window.ramper2.sol.request({
      method: 'sol_accounts'
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  solSignTransaction: `const solSignTransaction = async () => {
  try {
    const pubKey = new PublicKey(solanaAccount)
    const txs = new Transaction().add(SystemProgram.transfer({
      fromPubkey: pubKey,
      toPubkey: pubKey,
      lamports: LAMPORTS_PER_SOL / 100
    }))

    txs.recentBlockhash = (await cnn.getLatestBlockhash()).blockhash
    txs.feePayer = pubKey

    const result = await window.ramper2.sol.request({
      method: 'sol_sign',
      params: [txs]
    })

    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  solSignAllTransaction: `const solSignAllTransaction = async () => {
  try {
    const pubKey = new PublicKey(solanaAccount)
    const txs = new Transaction().add(SystemProgram.transfer({
      fromPubkey: pubKey,
      toPubkey: pubKey,
      lamports: LAMPORTS_PER_SOL / 100
    }))

    txs.recentBlockhash = (await cnn.getLatestBlockhash()).blockhash
    txs.feePayer = pubKey

    const transactions = [txs, txs, txs]

    const result = await window.ramper2.sol.request({
      method: 'sol_signAllTransactions',
      params: [transactions]
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  solSignMessage: `const solSignMessage = async () => {
  try {
    const result = await window.ramper2.sol.request({
      method: 'sol_signMessage',
      params: ['Some Message Should Goes Here']
    })
    return result
  } catch (err) {
    console.log({ err })
  }
}`
}

const nearCode = {
  getNearAccount: `const getNearAccount = async () => {
  try {
    const result = await window.ramper2.near.request({
      method: 'near_account',
    })

    const ressultAcc = get(result, 'result') || result
    return ressultAcc
  } catch (err) {
    console.log({ err })
  }
}`,

  getNearAccountState: `const getNearAccountState = async () => {
  try {
    const result = await window.ramper2.near.request({
      method: 'near_accountState',
    })
    const ressultAccState = get(result, 'result') || result
    return ressultAccState
  } catch (err) {
    console.log({ err })
  }
}`,

  nearSignAndSend: `const nearSignAndSend = async () => {
  try {
    const result = await window.ramper2.near.request({
      method: 'near_signAndSendTransaction',
      params: [{
        transactions: [{
          action: 'transfer',
          amount: 0.001
        }],
        receiver: resultAcc.accountId
      }]
    })
    return get(result, 'result') || result
  } catch (err) {
    console.log({ err })
  }
}`
}

const cosmosCode = {
  getCosmosKey: `const handleGetKeyCosmos = async () => {
  const chainId = 'pacific-1'

  try {
    const result = await window.ramper2.cosmos.enable(chainId)
    return result || {}
  } catch (err) {
    console.log({ err })
  }
}`,

  cosmosSignAmino: `const handleGetCosmosSignAmino = async () => {
  const chainId = 'pacific-1'

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

  const aDocToSign = makeSignDoc(msgs, fee, 'cosmoshub-4', 'Some Memo', '71079', '157')

  try {
    const result = await _provider.request({
      method: 'cosmos_signAmino',
      params: [
        {
          chainId,
          signer: 'cosmos1n4aqj7lucydfdfmml7kvw2lecld99ere2lagwd',
          signDoc: aDocToSign
        }
      ]
    })

    return result
  } catch (err) {
    console.log({ err })
  }
}`,

  cosmosSignDirect: `const handleGetSignDirect = async () => {
    const chainId = 'cosmos'

    const signDoc = {
    bodyBytes: base58.decode('8UNtVMXnMNvTxbtwixn83qXUKKTbAYXgftyqyJ9usXUKGxETvW1LfE9BQQ9s4q6bdvPRsHfyLpEHA1C86zuUkBnfEpLdHaXLJFi75yFfxgQjTWHiHUxFbWGeZWzvSj74BHiHvf1vjv279iPTL4845rHBctpEe63XqaeHKom9r9XsQsB4zWQ8HsLN9BAB4d8Qn1omtWqZwvP8J4BGBf9BBYN7g8cbABmkShpRuxUHFXwa8koVYgRCUpTvA6UQDq9eYAMBe7Wn59yBej6RczaFY1Jdoz7HrGdCjrzP5h5EqNfnzGh5BRg5vR2UQCVRV8ZGya7CwPVawiD7eFsXQnN1kDM3gsMnEvmfGwBhfrBK2TJzYtfPdMWfstdd9T4bMr7P9jkaXaMBfJo9qZfhpudZnFxXwQyCLNmRQzVqNKze4XqQR4GiVH'),
    authInfoBytes: base58.decode('QFGW6W8idWdMWnL3cgGRnKQYop4Z7je6kwJd3ZLaS4o9D8SahfXdo183S5cn2HzE4HaHhfZX3SfXb8K77r43KgLBooesUv2W7vcGATUPpiNJVtSSKRyE8mpG7ppSv6NZdvbLUjdR'),
    chainId: 'serenity-testnet-001',
    accountNumber: {
      low: 47,
      hihgh: 0,
      unsigned: false
    }
  }

  try {
    const result = await window.ramper2.cosmos.request({
      method: 'cosmos_signDirect',
      params: [{
        chainId,
        signer: cosmosKeyResult.bech32Address,
        signDoc
      }]
    })
    return get(result, 'result') || result
  } catch (err) {
    console.log({ err })
  }
}`,

  cosmosSuggestChain: `const handleCosmosSuggestChain = async () => {
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
    currencies: [{
      coinDenom: 'AURA',
      coinMinimalDenom: 'uaura',
      coinDecimals: 6
    }],
    feeCurrencies: [{
      coinDenom: 'AURA',
      coinMinimalDenom: 'uaura',
      coinDecimals: 6
    }],
    stakeCurrency: {
      coinDenom: 'AURA',
      coinMinimalDenom: 'uaura',
      coinDecimals: 6
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
    const result = window.ramper2.cosmos.request({
      method: 'cosmos_experimentalSuggestChain',
      params: [chainData]
    })

    return get(result, 'result') || result
  } catch (err) {
    console.log({ err })
  }
}`
}

export { evmCode, solanaCode, nearCode, cosmosCode }
