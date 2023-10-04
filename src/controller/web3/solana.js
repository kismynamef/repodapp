import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import get from 'lodash/get'
let solanaAccount

const useSolanaConnect = (sdk) => {
  const isWindow = typeof window !== 'undefined'

  const sol = isWindow && (sdk || window.ramper2?.sol)
  const cnn = new Connection('https://api.testnet.solana.com')

  const solAccounts = async () => {
    try {
      const result = await sol.request({
        method: 'sol_accounts'
        // params: []
      })
      console.log('result sol acc', result)
      solanaAccount = get(result, 'result[0]') || result[0]
      return solanaAccount
    } catch (e) {
    }
  }

  const solSignTransaction = async () => {
    try {
      console.log('solanaAccount', solanaAccount)
      const pubKey = new PublicKey(solanaAccount)
      const txs = new Transaction().add(SystemProgram.transfer({
        fromPubkey: pubKey,
        toPubkey: pubKey,
        lamports: LAMPORTS_PER_SOL / 100
      }))

      txs.recentBlockhash = (await cnn.getLatestBlockhash()).blockhash
      txs.feePayer = pubKey

      const result = await sol.request({
        method: 'sol_sign',
        params: [txs]
      })

      return get(result, 'result') || result
    } catch (error) {
      console.log({ error })
    }
  }

  const solSignAllTransaction = async () => {
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

      const result = await sol.request({
        method: 'sol_signAllTransactions',
        params: [transactions]
      })
      console.log({ result })
      return get(result, 'result') || result
    } catch (error) {
      console.log({ error })
    }
  }

  const solSignMessage = async () => {
    try {
      const result = await sol.request({
        method: 'sol_signMessage',
        params: ['Some Message Should Goes Here']
      })
      return get(result, 'result') || result
    } catch (error) {
      console.log({ error })
    }
  }

  return {
    solAccounts,
    solSignMessage,
    solSignTransaction,
    solSignAllTransaction
  }
}

export default useSolanaConnect
