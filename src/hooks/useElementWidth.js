const { useState, useEffect } = require('react')

const useElementWidth = (ref) => {
  const [elementWidth, setElementWidth] = useState(false)
  const [isReady, setIsReady] = useState(true)

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.clientWidth
      setElementWidth(width)
      setIsReady(true)
    }

    const onResize = () => {
      setIsReady(false)
      setElementWidth('100%')
      clearTimeout(window.timer)
      window.timer = setTimeout(() => {
        if (ref.current) {
          const width = ref.current.clientWidth
          setElementWidth(width)
        }
        setIsReady(true)
      }, 300)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [ref.current])

  return {
    width: elementWidth,
    isReady
  }
}

export default useElementWidth
