// import React, { useState, useEffect } from "react";

// import { useMutation } from "@apollo/client";
// import { ADD_PRODUCT, GET_PRODUCTS } from "../queries";

// type Product = {
//   _id: string;
//   name: string;
// };

// export default function AddProducts() {
//   const [addProduct, { loading, error, data }] = useMutation(ADD_PRODUCT, {
//     refetchQueries: [GET_PRODUCTS, "products"],
//   });

//   const [name, setName] = useState("");
//   const [nums, setNums] = useState(50);

//   async function gen(event) {
//     event.preventDefault();
//     for (let i = 0; i < nums; i++) {
//       addProduct({
//         variables: {
//           name: `product ${Math.floor(Math.random() * 100)}`,
//           price: Math.floor(Math.random() * 50),
//           description: "some product description",
//           sellerId: "70wtiJj79ZQv8zlQE1h1nNEPVu33",
//           date: `2023/${Math.floor(Math.random() * 12) + 1}/${
//             Math.floor(Math.random() * 31) + 1
//           }`,
//           condition: "fair",
//           image: "www.url.com",
//           category: "furniture",
//         },
//       });
//     }
//   }

//   async function add(event) {
//     event.preventDefault();
//     addProduct({
//       variables: {
//         name: name,
//         price: Math.floor(Math.random() * 50),
//         description: "some product description",
//         sellerId: "123",
//         date: new Date().toLocaleDateString(),
//         condition: "fair",
//         image: "www.url.com",
//         category: "furniture",
//       },
//     });
//   }

//   useEffect(() => {
//     if (!loading && !error && data) {
//       //   document.getElementById("product-form").reset();
//       console.log(data);
//     }
//   }, [loading]);

//   return (
//     <div>
//       <h1>Product Form:</h1>

//       <form onSubmit={gen}>
//         <label>
//           Generate Products:
//           <input
//             type="number"
//             value={nums}
//             onChange={(e) => setNums(e.target.value)}
//           />
//         </label>
//         <input type="submit" />
//       </form>

//       <br></br>

//       <form onSubmit={add}>
//         <label>
//           Add Product:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <input type="submit" />
//       </form>
//     </div>
//   );
// }
