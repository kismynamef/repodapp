import React, { useEffect, useMemo } from 'react'
import ConnectCardBox from '../ConnectCard'
import ButtonConnect from '../ButtonConnect'
import { solanaCode } from '../../controller/commons/constant'
import { useConnect } from '../../controller/context/ContextProvider'
import useStateCustom from '../../hooks/useStateCustom'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'

const cnn = new Connection('https://api.testnet.solana.com')

function ContentSolana() {
  const [state, setState] = useStateCustom()

  const { isConnected, isExtension, client, connect: onConnect } = useConnect()

  const _provider = useMemo(() => {
    if (isExtension) {
      return window.ramper2.sol
    }

    return client
  }, [])

  const onSolAccount = async () => {
    try {
      const response = await _provider.request({ method: 'sol_accounts' })
      setState({
        solAccounts: isExtension ? response : response.error || response.result
      })
    } catch (e) {}
  }

  const onSolSignTransaction = async () => {
    try {
      const pubKey = new PublicKey(state.solAccounts[0])
      const txs = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: pubKey,
          toPubkey: pubKey,
          lamports: LAMPORTS_PER_SOL / 100
        })
      )

      txs.recentBlockhash = (await cnn.getLatestBlockhash()).blockhash
      txs.feePayer = pubKey

      const response = await _provider.request({
        method: 'sol_sign',
        params: [txs]
      })

      setState({
        solSignTransactionPublicKey: isExtension
          ? response.publicKey
          : JSON.stringify(response.error || response.result?.publicKey),
        solSignTransactionSignature: isExtension
          ? response.signature
          : JSON.stringify(response.error || response.result?.signature)
      })
    } catch (e) {
      //
    }
  }

  const onSolSignAllTransactions = async () => {
    try {
      const pubKey = new PublicKey(state.solAccounts[0])
      const txs = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: pubKey,
          toPubkey: pubKey,
          lamports: LAMPORTS_PER_SOL / 100
        })
      )

      txs.recentBlockhash = (await cnn.getLatestBlockhash()).blockhash
      txs.feePayer = pubKey

      const transactions = [txs, txs, txs]

      const response = await _provider.request({
        method: 'sol_signAllTransactions',
        params: [transactions]
      })
      console.log(
        '🚀 ~ file: index.js ~ line 82 ~ onSolSignAllTransactions ~ response',
        response
      )

      setState({
        solSignAllTransactionPublicKey: isExtension
          ? response.publicKey
          : JSON.stringify(response.error || response.result?.publicKey),
        solSignAllTransactionSignatures: isExtension
          ? response.signatures
          : JSON.stringify(response.error || response.result?.signatures)
      })
    } catch (e) {
      //
    }
  }

  const onSolSignMessage = async () => {
    try {
      const response = await _provider.request({
        method: 'sol_signMessage',
        params: ['Some Message Should Goes Here']
      })

      setState({
        solSignMessageAddress: isExtension
          ? response.address
          : JSON.stringify(response.error || response.result?.address),
        solSignMessageSignature: isExtension
          ? response.signature
          : JSON.stringify(response.error || response.result?.signature)
      })
    } catch (e) {}
  }

  // connect actions
  const handleOpenModal = (code, click, status) => () => {
    window.openModal({
      content: code,
      onClickModal: click,
      isDisableRunCode: status
    })
  }

  useEffect(() => {
    if (isConnected) {
      onSolAccount()
    }
  }, [isConnected])

  const walletAddress = state.solAccounts && state.solAccounts[0]

  return (
    <>
      {isConnected && (
        <div className="flex items-start flex-col lg:flex-row lg:items-end mb-4">
          {walletAddress && (
            <div className="w-full sm:w-[auto] px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] break-words">
              <span className="text-[#d9b432]">Account</span> {walletAddress}
            </div>
          )}
        </div>
      )}
      <div className="masonry sm:masonry-sm md:masonry-md">
        {/* get accounts */}
        <ConnectCardBox title="get accounts">
          <ButtonConnect
            isDisable={isConnected}
            titleBtn={isConnected ? 'Connected' : 'Connect'}
            onClick={onSolAccount}
            isHideShowCode
          />

          <ButtonConnect
            isDisable={!isConnected}
            titleBtn="Get Accounts"
            onClick={onSolAccount}
            onClickShowCode={handleOpenModal(
              solanaCode.solAccounts,
              onSolAccount,
              !isConnected
            )}
            isNoSpace
            resultTitle="sol_accounts result"
            result={state.solAccounts}
          />
        </ConnectCardBox>

        {/* sign transaction */}
        <ConnectCardBox title="sign transaction">
          <ButtonConnect
            isDisable={!state.solAccounts}
            titleBtn="Sign Transaction"
            resultTitle="sol_signTransaction result"
            onClick={onSolSignTransaction}
            onClickShowCode={handleOpenModal(
              solanaCode.solSignTransaction,
              onSolSignTransaction,
              !state.solAccounts
            )}
            isNoSpace
            // result={state.solSignTransaction}
            resultArr={
              state.solSignTransactionPublicKey &&
              state.solSignTransactionSignature && [
                {
                  title: 'Public Key Result',
                  result: state.solSignTransactionPublicKey
                },
                {
                  title: 'Signature Result',
                  result: state.solSignTransactionSignature
                }
              ]
            }
          />
        </ConnectCardBox>

        {/* sign all transaction */}
        <ConnectCardBox title="sign all transaction">
          <ButtonConnect
            isDisable={!state.solAccounts}
            titleBtn="Sign  All Transaction"
            onClick={onSolSignAllTransactions}
            resultTitle="sol_signAllTransactions result"
            onClickShowCode={handleOpenModal(
              solanaCode.solSignAllTransaction,
              onSolSignAllTransactions,
              !state.solAccounts
            )}
            isNoSpace
            // result={state.solSignAllTransaction}
            resultArr={
              state.solSignAllTransactionPublicKey &&
              state.solSignAllTransactionSignatures && [
                {
                  title: 'Public Key Result',
                  result: state.solSignAllTransactionPublicKey
                },
                {
                  title: 'Signature Result',
                  result: state.solSignAllTransactionSignatures
                }
              ]
            }
          />
        </ConnectCardBox>

        {/* sign messages */}
        <ConnectCardBox title="sign messages">
          <ButtonConnect
            isDisable={!state.solAccounts}
            titleBtn="Sign Messages"
            onClick={onSolSignMessage}
            onClickShowCode={handleOpenModal(
              solanaCode.solSignMessage,
              onSolSignMessage,
              !state.solAccounts
            )}
            isNoSpace
            resultTitle="Sign Messages"
            // result={state.solSignMessage}
            resultArr={
              state.solSignMessageAddress &&
              state.solSignMessageSignature && [
                {
                  title: 'Public Key Result',
                  result: state.solSignMessageAddress
                },
                {
                  title: 'Signature Result',
                  result: state.solSignMessageSignature
                }
              ]
            }
          />
        </ConnectCardBox>
      </div>
    </>
  )
}

export default ContentSolana
