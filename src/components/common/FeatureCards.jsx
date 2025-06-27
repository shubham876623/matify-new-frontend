import React from 'react'

function FeatureCards() {
  return (
    <div className="flex-1 bg-dark-gradient flex flex-col max-[850px]:hidden">
        <div className='flex items-center justify-center w-full gap-5 mt-[2rem]'>
          <img src='/signupimages/matify-logo.svg' alt='Matify-logo' className='w-[4rem] h-[4rem]'/>
          <h1 className="text-[1.8rem] leading-[26.6px] text-white font-extrabold tracking-[1rem]">MATIFY</h1>
        </div>
        <div className='w-[85%] ml-auto mr-auto mt-4 flex-1 dynamic-max-width'>
            <div className="grid grid-cols-3 gap-3">
              <img src="/signupimages/row-1col-1.svg" className="col-span-2 w-full h-auto object-cover" />
              <img src="/signupimages/row-1col-2.svg" className="col-span-1 w-full h-auto object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <img src="/signupimages/row-2col-1.svg" className="col-span-1 w-full h-auto object-cover" />
              <img src="/signupimages/row-2col-2.svg" className="col-span-2 w-full h-auto object-cover" />
            </div>
            <div className="grid grid-cols-6 gap-3">
              <img src="/signupimages/row-3col-1.svg" className="col-span-3 w-full h-auto object-cover" />
              <img src="/signupimages/row-3col-2.svg" className="col-span-3 w-full h-auto object-cover" />
            </div>
        </div>
      </div>
  )
}

export default FeatureCards