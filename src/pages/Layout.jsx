import React from 'react'

function Layout({ children }) {
  return (
    <div className='w-screen h-screen flex bg-white overflow-auto'>
        { children }
    </div>
  )
}

export default Layout