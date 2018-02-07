const { Client } = require('pg');


function addToPickingList (address_id, item_id, quantity, email, reserve_id){
 // check if necessary ti change name of parameter adresse_id by stock_adress_id ??
 const client = new Client();
 console.log("debut AddToPickingList - item : " + item_id + " vers :" + address_id + " qté : " + quantity);
   client.connect();
   return client.query("INSERT INTO picking_lists (email, stock_address_id, qty, reserve_id) VALUES ($1, $2, $3, $4)",
   [email, address_id, quantity, reserve_id ])
 .then(result => {
   console.log("success");
   client.end();
   return({
     code: "201",
     text: "OK"
   });
   })
 .catch(error => {
   console.warn(error);
   client.end();
   return({
     code: "400",
     text: "KO "+ error
   })
   })
}


addToPickingList("91c79990-13f8-4e93-a413-c9711dfc29c9","123456", 5,"toto@toto.com", "3402c2b7-1abd-46db-a517-44650f7916e1"  )

module.exports = addToPickingList;
