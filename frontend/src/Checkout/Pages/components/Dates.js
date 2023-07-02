import "../Invoice.css"

const Dates = ({invoiceDate}) => {
   return (
     <div>
       <article>
         <ul>
           {/*}
           <li className="p-1 ">
             <span className="font-bold">Invoicer number:</span> {invoiceNumber}
           </li>*/}
           <li>
             <span className="font-bold">Invoice date:</span> {invoiceDate}
           </li>
         </ul>
       </article>
      </div>
   )
 }

 export default Dates;
 