import React from 'react';
import bgConnect from '../../assets/bg-connect.svg';
function ConnectCardBox({ title, children, className }) {
  const containerStyle = `text-white w-full bg-[#1b1b1b] rounded-lg p-5 relative z-0 overflow-hidden break-inside mb-6 ${className}`;
  const titleText = 'text-center text-xl uppercase text-[#d9b432] mb-7';
  const imgBgItem = 'absolute -top-[40px] left-0 -z-[1]';

  return (
    <div className={containerStyle}>
      <img src={bgConnect} alt='' className={imgBgItem} />
      <div className={titleText}>{title}</div>
      {children}
    </div>
  );
}

export default ConnectCardBox;
