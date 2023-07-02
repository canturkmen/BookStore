import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const NavBar = () => {
  return (
    <div className='navbar'>
      <div className='wrapper'>
         <div className='search'>
            <input className='searchInput' type='text' placeholder='Search...'/>
            <SearchIcon />
         </div>
         <div className='items'>
            <div className='item'>
               <LanguageIcon />
               English
            </div>
            <div className='item'>
               <DarkModeIcon />
            </div>
            <div className='item'>
               <FullscreenExitIcon />
            </div>
            <div className='item'>
               <NotificationsNoneIcon />
               <div className='counter'>1</div>
            </div>
            <div className='item'>
               <ChatBubbleOutlineOutlinedIcon />
               <div className='counter'>2</div>
            </div>
            <div className='item'>
               <FormatListBulletedIcon/>
            </div>
            <div className='item'>
               <img 
                  src="https://images.pexels.com/photos/16211569/pexels-photo-16211569.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" 
                  alt="" 
                  className="avatar"
               />
            </div>
         </div>
      </div>
    </div>
  )
}

export default NavBar;