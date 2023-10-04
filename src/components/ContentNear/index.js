import React, { useEffect, useMemo } from 'react'

import { useConnect } from '../../controller/context/ContextProvider'
import ConnectCardBox from '../ConnectCard'
import ButtonConnect from '../ButtonConnect'
import { nearCode } from '../../controller/commons/constant'
import useStateCustom from '../../hooks/useStateCustom'

function ContentNear () {
  const { isConnected, client, isExtension, connect: onConnect } = useConnect()

  const [state, setState] = useStateCustom()
  // connect actions

  const _provider = useMemo(() => {
    if (!isExtension) {
      return client
    }

    return window.ramper2?.near
  }, [])

  /**
   * Get Active Near Account
   */
  const onNearAccount = async () => {
    // Extension Only - Public Request Key Will Be Store In Local Storage
    try {
      const response = await _provider.request({ method: 'near_account' })
      setState('onNearAccount', isExtension ? response : (response.error || response.result))
    } catch (e) {
      //
    }
  }

  /** Get Active Near Account State
   */
  const onNearAccountState = async () => {
    try {
      const response = await _provider.request({ method: 'near_accountState' })
      setState('onNearAccountState', isExtension ? response : (response.error || response.result))
    } catch (e) {
      //
    }
  }

  const onSignAndSendTransaction = async () => {
    try {
      const response = await _provider.request({
        method: 'near_signAndSendTransaction',
        params: [{
          transactions: [{
            action: 'transfer',
            amount: 0.001
          }],
          receiver: state.onNearAccount?.accountId
        }]
      })
      setState('onSignAndSendTransaction', isExtension ? response : (response.error || response.result))
    } catch (e) {
      console.log('🚀 ~ file: index.js ~ line 62 ~ onSignAndSend ~ e', e)
      //
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

  return (
    <div className='masonry sm:masonry-sm md:masonry-md'>
      {/* connect actions */}
      <ConnectCardBox
        title='basic actions'
      >
        <ButtonConnect
          isDisable={isConnected}
          titleBtn={isConnected ? 'Connected' : 'Connect'}
          onClick={onConnect}
          isHideShowCode
        />

        <ButtonConnect
          isDisable={!isConnected}
          titleBtn='Get Near Accounts'
          onClick={onNearAccount}
          onClickShowCode={handleOpenModal(nearCode.getNearAccount, onNearAccount, !isConnected)}
          isNoSpace
          resultTitle='Near Account Result'
          result={state.onNearAccount}
        />
      </ConnectCardBox>

      <ConnectCardBox
        title='Near Actions'
      >
        <ButtonConnect
          isDisable={!isConnected && !state.onNearAccount}
          titleBtn='Sign Near Account State'
          onClick={onNearAccountState}
          onClickShowCode={handleOpenModal(nearCode.getNearAccountState, onNearAccountState, !isConnected)}
          resultTitle='Sign Near Account State Result'
          result={state.onNearAccountState}
        />

        <ButtonConnect
          isDisable={!isConnected && !state.onNearAccount}
          titleBtn='Sign & Send Transactions'
          onClick={onSignAndSendTransaction}
          onClickShowCode={handleOpenModal(nearCode.nearSignAndSend, onSignAndSendTransaction, !isConnected)}
          resultTitle='Sign & Send Transaction Result'
          result={state.onSignAndSendTransaction}
          isNoSpace
        />
      </ConnectCardBox>
    </div>
  )
}

export default ContentNear
