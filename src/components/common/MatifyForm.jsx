import React from 'react'

function MatifyForm({ children }) {
  return (
    <div className="flex-1 grid items-center">
        <div className='matify-form w-[55%] mr-auto ml-auto max-w-[500px]'>{children}</div>
    </div>
  )
}

export default MatifyForm