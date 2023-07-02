import React from 'react'
import "./Featured.css"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {CircularProgressbar} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Featured = () => {
  return (
    <div className='featured'> 
      <div className='featuredTop'>
         <h1 className='featuredTitle'>Total Revenue</h1>
         <MoreVertIcon fontSize='small'/>
      </div>
      <div className='featuredBottom'>
         <div className='featuredChart'>
            <CircularProgressbar value={70} text={"70%"} strokeWidth={5}/>
         </div>
         <p className='bottomTitle'>Total sales made today</p>
         <p className='bottomAmount'>$420</p>
         <p className='bottomDesc'>
         Previous transactions processing. 
         Last payments may not be included. 
         </p>
         <div className='bottomSummary'>
            <div className='bottomItem'>
               <div className='bottomItemTitle'>Target</div>
               <div className='bottomItemResult negative'>
                  <KeyboardArrowDownIcon fontSize='small'/>
                  <div className='resultAmount'>$24.6k</div>
               </div>
            </div>
            <div className='bottomItem'>
               <div className='bottomItemTitle'>Last Week</div>
               <div className='bottomItemResult positive'>
                  <KeyboardArrowUpIcon fontSize='small'/>
                  <div className='resultAmount'>$6.4k</div>
               </div>
            </div>
            <div className='bottomItem'>
               <div className='bottomItemTitle'>Last Month</div>
               <div className='bottomItemResult positive'>
                  <KeyboardArrowUpIcon fontSize='small'/>
                  <div className='resultAmount'>$12.8k</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Featured;