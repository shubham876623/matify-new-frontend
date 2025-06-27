import React from 'react';
import { useEffect, useState } from 'react';


import { Link, useNavigate } from 'react-router-dom';
const Header = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('username');
  // const setUsername(username)
  const navigate = useNavigate();
    useEffect(() => {
    if (token) {
      setUsername(token); 
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh');

    setIsLoggedIn(false);
    navigate('/login');
  };
console.log(username)


  return (
    <header className="bg-white border-b border-[#e4e4e4] min-h-[72px] flex items-center justify-between px-5 max-[850px]:pl-[4rem]">
      <div className="flex items-center">
        <h1 className="text-[1.2rem] font-semibold leading-[1.5rem] text-[#272727] font-gilroy">
          Welcome back, {user} 👋
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="w-8 h-8 bg-white border border-[#ececec] rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <img 
            src="/images/img_icon.svg" 
            alt="notifications" 
            className="w-[13px] h-[11px]"
          />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="h-8 px-4 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>

        {/* Profile Avatar */}
        <button className="h-8 bg-white border border-[#ececec] rounded-lg flex items-center gap-2 px-2 hover:bg-gray-50 transition-colors">
          <img 
            src="/images/img_avatar.png" 
            alt="profile" 
            className="w-6 h-6 rounded-full"
          />
          <img 
            src="/images/img_chevrondown.svg" 
            alt="dropdown" 
            className="w-4 h-4"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
