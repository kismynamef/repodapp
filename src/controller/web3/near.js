import { get } from 'lodash'
import { useState } from 'react'

const useNearConnect = (sdk) => {
  const isWindow = typeof window !== 'undefined'

  const near = isWindow && (sdk || window.ramper2?.near)

  const [nearAccount, setNearAccount] = useState()

  const getNearAccount = async () => {
    try {
      const result = await near.request({
        method: 'near_account',
        params: ['crown', 'app.nearcrowd.near']
      })

      const ressultAcc = get(result, 'result') || result
      setNearAccount(ressultAcc)
      return ressultAcc
    } catch (e) {
    }
  }

  const getNearAccountState = async () => {
    const result = await near.request({
      method: 'near_accountState',
      params: []
    })
    const ressultAccState = get(result, 'result') || result
    return ressultAccState
  }

  const nearSignAndSend = async () => {
    try {
      const result = await near.request({
        method: 'near_signAndSendTransaction',
        params: [{
          transactions: [{
            action: 'transfer',
            amount: 0.001
          }],
          receiver: '7c091a74520d052d1656e90cbbcfb0d9a18663acefa56ba28a9b5fe1f7a40f08'
        }]
      })
      return get(result, 'result') || result
    } catch (e) {
    }
  }

  return {
    getNearAccountState,
    getNearAccount,
    nearSignAndSend
  }
}

export default useNearConnect
