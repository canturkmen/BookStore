export const userColumns = [
   {field: "id", headerName: "ID", width: 70},
   {
       field:"user",
       headerName:"User",
       width:230,
       renderCell: (params)=>{
           return(
               <div className="cellWithImg">
                   <img className="cellImg" src={params.row.img} alt="avatar"/>
                   {params.row.username}
               </div>
           );     
       }
   },
   {
       field: "email", headerName: "Email", width: 230,
   },

   {
       field: "age", headerName: "Age", width: 100,
   },
   
   {
       field: "status", headerName: "Status", width: 160,
       renderCell:(params)=>{
           return(
               <div className={`cellWithStatus ${params.row.status}`}>
                   {params.row.status}
               </div>
           );
       }
   }
];


//temporary data
export const userRows = [
   {
       id: 1143155,
       username: "John Smith",
       img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1600",
       email: "1snow@gmail.com",
       status: "Active",
       age: 22,
   },
   {
       id: 2235235,
       username: "Micheal Doe",
       img: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600",
       email: "2snow@gmail.com",
       status: "Passive",
       age: 18,
   },
   {
       id: 2357741,
       username: "Jane Smith",
       img: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
       email: "3snow@gmail.com",
       status: "Pending",
       age: 45,
   },
   {
       id: 2342355,
       username: "Harold Carol",
       img: "https://images.pexels.com/photos/1136575/pexels-photo-1136575.jpeg?auto=compress&cs=tinysrgb&w=1600",
       email: "4snow@gmail.com",
       status: "Active",
       age: 16,
   },
   
]