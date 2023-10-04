import React from 'react'

function ButtonConnect({
  isDisable,
  onClick,
  titleBtn,
  onClickShowCode,
  isNoSpace,
  isHideShowCode,
  result,
  resultArr,
  resultTitle,
  isOveflowHiddenText = false
}) {
  const buttonAction =
    'w-full p-3.5 bg-[#e5b842] rounded-lg text-center cursor-pointer hover:bg-[#DEA62E] hover:text-black duration-300 disabled:bg-[#292929] disabled:text-white disabled:cursor-not-allowed'
  const boxModal =
    'text-[13px] text-[#a49a80] flex items-center justify-center mt-1.5 cursor-pointer hover:text-[#f1d961] duration-300'
  const textModal = 'icon-web_show-code text-xl mr-1.5'

  const boxResult = `w-full p-3 rounded-lg bg-[#e5b7431a] mt-6 text-sm text-[#e5b842] break-words ${
    isOveflowHiddenText && 'truncate'
  }`
  const titleResult = 'text-[13px] text-[#c4c4c4] mb-1'

  const renderResult = () => {
    return resultArr.map((item, i) => {
      return (
        <div id="eth_account-result" className={boxResult} key={i}>
          {item.title && <div className={titleResult}>{item.title}:</div>}
          {item.result}
        </div>
      )
    })
  }

  return (
    <div className={`mb-6 ${isNoSpace && 'mb-0'}`}>
      <button className={buttonAction} onClick={onClick} disabled={isDisable}>
        {titleBtn}
      </button>

      {!isHideShowCode && (
        <div className={boxModal} onClick={onClickShowCode}>
          <span className={textModal}></span>
          Show code example
        </div>
      )}

      {result && (
        <div id="eth_account-result" className={boxResult}>
          <div className={titleResult}>{resultTitle}:</div>
          {JSON.stringify(result)}
        </div>
      )}

      {resultArr && renderResult()}
    </div>
  )
}

export default ButtonConnect
