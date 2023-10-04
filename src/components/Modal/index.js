import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ModalShowCode() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenModal = (props) => {
    setIsOpen(true);
    setModalContent(props);
  };

  const handleShowCode = async () => {
    await modalContent.onClickModal();
    setTimeout(() => {
      handleCloseModal();
    }, 1000);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCopyContent = (content) => () => {
    window.navigator.clipboard.writeText(content);
    setIsCopied(true);
  };

  useEffect(() => {
    window.openModal = handleOpenModal;
    window.closeModal = handleCloseModal;
  }, []);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  return (
    <div>
      {isOpen ? (
        <div className='w-screen h-screen fixed top-0 left-0 right-0 z-50 bg-transparent'>
          <div
            className='w-screen h-screen absolute top-0 left-0 right-0 z-0 bg-[#0608164d] backdrop-blur-xl'
            onClick={handleCloseModal}
          />
          <div className='w-[93%] md:w-[50rem] bg-[#242424] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 text-white z-10 flex flex-col items-center'>
            <div className='w-full flex items-center justify-between text-xl mb-6'>
              Show Code
              <div
                className='p-1 rounded-[50%] w-[35px] h-[35px] flex items-center justify-center cursor-pointer duration-300 hover:bg-black363636'
                onClick={handleCloseModal}
              >
                <span className='icon-web_close text-2xl'></span>
              </div>
            </div>

            <div className='w-full max-h-[250px] rounded-lg overflow-y-auto scrollbar-hide'>
              <div className='rounded-[50%] w-[35px] h-[35px] fixed right-7 top-[5.5rem] flex items-center justify-center cursor-pointer duration-300 hover:bg-black363636 group'>
                <div className='absolute bottom-[2.5rem] left-1/2 text-xs transform -translate-x-1/2 bg-[#646464] rounded whitespace-nowrap duration-300 h-0 group-hover:h-[25px] group-hover:px-2 group-hover:py-1 overflow-hidden'>
                  <div className='w-4 overflow-hidden inline-block absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
                    <div className=' h-2 w-2 bg-[#646464] -rotate-45 transform origin-top-left'></div>
                  </div>
                  {isCopied ? 'Copied' : 'Copy to clipboard'}
                </div>
                <span
                  className={`icon-${
                    isCopied ? 'web_icon-check-done' : 'web_copy'
                  } text-xl cursor-pointer duration-300 p-1`}
                  onClick={handleCopyContent(modalContent.content)}
                />
              </div>
              <SyntaxHighlighter
                language='javascript'
                style={vscDarkPlus}
                customStyle={{
                  margin: '0',
                  overflowX: 'hidden',
                  padding: '1.25rem',
                }}
                className='h-full my-0 bg-transparent rounded-lg p-5 pr-[13rem] overflow-x-hidden text-ellipsis break-words'
              >
                {modalContent.content}
              </SyntaxHighlighter>
            </div>

            {modalContent.onClickModal && (
              <button
                className='w-1/3 mt-5 mx-auto py-2 rounded-lg bg-[#e5b842] hover:bg-[#DEA62E] hover:text-black duration-300 disabled:bg-[#292929] disabled:text-white disabled:cursor-not-allowed'
                onClick={handleShowCode}
                disabled={modalContent.isDisableRunCode}
              >
                Run Code
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ModalShowCode;
