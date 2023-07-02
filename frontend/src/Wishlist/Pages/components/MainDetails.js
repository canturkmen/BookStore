import "../Invoice.css"
const MainDetails = ({ name, address }) => {
   return (
     <div>
       <section>
         <h2 className="font-bold text-3xl uppercase mb-1">{name}</h2>
         <p>{address}</p>
       </section>
      </div>
   )
 }
 
export default MainDetails;
  