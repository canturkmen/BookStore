import React from 'react'
import "./Widget.css";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { color } from 'framer-motion';


const Widget = (props) => {
  let data; /*determine data according to type of widget*/

  //temporary
  const amount = 100;
  const diff = 20;

  if(props.type === "user"){
      data={
         widgetTitle: "USERS",
         isMoney: false,
         widgetLink:"See all users",
         icon: (
            <Person2OutlinedIcon className='widgetIcon'
               style={{color:"crimson", backgroundColor: "rgba(255, 0, 0, 0.2)"}}             
            />
         )
      }
  }

  else if(props.type === "order"){
      data={
         widgetTitle: "ORDERS",
         isMoney: false,
         widgetLink:"View all orders",
         icon: (
            <ShoppingCartOutlinedIcon className='widgetIcon'
               style={{color:"goldenrod", backgroundColor: "rgba(218, 165, 32, 0.2)"}}    
            />
         )
      }
  }

  else if(props.type === "earning"){
      data={
         widgetTitle: "EARNINGS",
         isMoney: true,
         widgetLink:"View net earnings",
         icon: (
            <MonetizationOnOutlinedIcon className='widgetIcon'
               style={{color:"green", backgroundColor: "rgba(0, 128, 0, 0.2)"}}   
            />
         )
      }
  }

  else if(props.type === "balance"){
      data={
         widgetTitle: "BALANCE",
         isMoney: true,
         widgetLink:"See details",
         icon: (
            <AccountBalanceWalletIcon className='widgetIcon'
               style={{color:"purple", backgroundColor: "rgba(128, 0, 128, 0.2)"}} 
            />
         )
      }
  }
  return (
    <div className='widget'>
      <div className='left'>
         <span className='widgetTitle'>{data.widgetTitle}</span>
         <span className='widgetCounter'>{data.isMoney && "$"} {amount}</span>
         <span className='widgetLink'>{data.widgetLink}</span>  
      </div>
      <div className='right'>
         <div className='percantage positive'> {/*"positive" should be changed dynamically, now it is just design*/}
            <KeyboardArrowUpIcon/>
            {diff}%
         </div>
         {data.icon}
      </div>
    </div>
  )
}

export default Widget;