import { useEffect, useState } from 'react'

const useStateCustom = () => {
  const [state, setState] = useState({})

  const onStateUpdate = (field, value) => {
    if (typeof field === 'object') {
      setState(oldState => {
        const stateUpdate = { ...oldState }

        Object.keys(field).forEach(key => {
          stateUpdate[key] = field[key]
        })
        return stateUpdate
      })
    } else {
      setState(oldState => ({ ...oldState, [field]: value }))
    }
  }

  return [state, onStateUpdate]
}

export default useStateCustom
