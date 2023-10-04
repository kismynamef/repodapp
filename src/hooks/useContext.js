import React from 'react'

const Context = React.createContext()

const useUserContext = () => {
  return React.useContext(Context)
}

export default useUserContext
