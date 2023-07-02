import "../Invoice.css"
const Notes = ({ notes }) => {
   return (
     <div>
       <section>
         <h3>Additional notes</h3>
         <p>{notes}</p>
       </section>
      </div>
   )
 }

 export default Notes;