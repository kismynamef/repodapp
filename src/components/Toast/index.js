import React, { useState, useEffect } from 'react'

function ToastNoti () {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState()

  const handleOpen = (props) => {
    setIsOpen(true)
    setContent(props)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    window.openToast = handleOpen
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        handleClose()
      }, 2000)
    }
  }, [isOpen])

  return (
    <div>
      {isOpen
        ? <div className='z-[1000] bg-[#424242] py-2 px-4 rounded-3xl fixed top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2'>
            {content.content}
          </div>
        : null}
    </div>
  )
}

export default ToastNoti
