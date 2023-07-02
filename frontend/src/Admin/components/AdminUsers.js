import React from 'react'
import SideBar from './SideBar';
import NavBar from './NavBar';
import DataTable from './DataTable';

export const AdminUsers = () => {
  return (
   <div className='list'>
      <SideBar/>
      <div className='list-container'>
         <NavBar/>
         <DataTable/>
      </div>
   </div>
  )
}

export default AdminUsers;
