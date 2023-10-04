import React from 'react';

function InfoBarConnect({ chainId, network, account }) {
  return (
    <div className='flex items-center mb-4'>
      <div className='px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] mr-4'>
        <span className='text-[#d9b432]'>Chain ID</span> {chainId}
      </div>

      <div className='px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842] mr-4'>
        <span className='text-[#d9b432]'>Network</span> {network}
      </div>

      <div className='px-5 py-3 bg-black242424 text-white text-[13px] rounded-[32px] border-[1px] border-[#e5b842]'>
        <span className='text-[#d9b432]'>Account</span> {account}
      </div>
    </div>
  );
}

export default InfoBarConnect;
