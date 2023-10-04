import React, { useState } from 'react'

function DropdownTab ({
  arrData,
  itemChoose,
  onChoose
}) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)

  const handleOpenDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown)
  }

  return (
    <div className='relative min-w-[12rem] mb-5 cursor-pointer' onClick={handleOpenDropdown}>
      <div className='w-full py-2 px-2.5 bg-[#1b1b1b] text-white rounded-lg flex items-center justify-between'>
        <div className='flex items-center justify-center'>
          <span className={`${itemChoose.icon} text-[#d9b432] mr-1 text-2xl`}></span>
          {itemChoose.name}
        </div>

        <span className='icon-web_arrow_down'></span>
      </div>

      <div className={`absolute w-full rounded-lg top-[3.5rem] bg-[#202020] z-50 ${isOpenDropdown ? 'max-h-[15rem]' : 'max-h-[0rem]'}  overflow-auto duration-300`}>
        {arrData.map((item, i) => {
          return (
            <div className='flex items-center text-white p-2.5 cursor-pointer hover:bg-black363636 rounded-lg' key={i} onClick={onChoose(item)}>
              <span className={`${item.icon} text-[#d9b432] mr-1 text-2xl`}></span>
              {item.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DropdownTab
