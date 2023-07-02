import React from 'react'
import "./AdminProducts.css"

export const AdminProductPair = ({ label, name }) => {
  return (
   <div className='labelInputPair'>
      <label className='formLabels'>{label}</label>
      <input className="formInputs" type="text" name={name} />
   </div>
  )
}

export default AdminProductPair;
