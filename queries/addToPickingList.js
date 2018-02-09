const { Client } = require('pg');
const getStockAdressIdFromAddressID = require ('./getStockAdressIdFromAddressID');
const getReserveId = require ('./getReserveId');



function addToPickingList(stock_address_id, quantity, email, store) {

  const client = new Client();
  let reserve_id;

  return getReserveId(store)
  // verifier si ce stock est déjà dans la pickingList
  .then(result => {
    reserve_id = result;
    client.connect();
    return client.query("SELECT count(*) FROM picking_lists WHERE stock_address_id = $1", [stock_address_id])
  })
  .then(result => {
console.log('result.rows[0].count = ' + result.rows[0].count);
    if (result.rows[0].count === "0"){
      console.log('insert');
      return client.query(
        "INSERT INTO picking_lists (email, stock_address_id, qty, reserve_id) VALUES ($1, $2, $3, $4)",
        [email, stock_address_id, quantity, reserve_id]
      )
    } else {
      return client.query(
        "UPDATE picking_lists SET qty = qty + $1 WHERE stock_address_id = $2",
        [quantity, stock_address_id]
      )
    }

  })
  .then(result => {
    client.end();
    return {
      code: "201",
      text: "OK"
    };
  })
  .catch(error => {
    console.warn(error);
    client.end();
    return {
      code: "400",
      text: "KO " + error
    };
  });

}


module.exports = addToPickingList;
