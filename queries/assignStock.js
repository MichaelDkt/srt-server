const { Client } = require('pg');
const getReserveId = require("./getReserveId");

//This function assigns stock to an address
//If this item is already in this location: update stock qty
//If there is no stock in this address: create new line of stock
//If there is no more stock: delete the line of stock

function assignStock(store, address, item_id, qty){
  const client = new Client();
  let address_id;
  client.connect();

  return getReserveId(store)
    // search address_id (uuid) from address name X-aaa and reserve_id
    .then(reserve_id => {
      return client.query("SELECT id FROM addresses WHERE reserve_id = $1 and address = $2", [reserve_id, address]);
    })

    // check if this item code is already in this address_id
    .then(result => {
      address_id = result.rows[0].id;
      return client.query("SELECT address_id, sum(qty) as qty, count(*) FROM stock_addresses WHERE address_id = $1 and item_id = $2 group by address_id", [address_id, item_id])
    })

    // insert a product in address, with qty
    .then(result => {
      if (result.rows.length === 0){
        return client.query("INSERT INTO stock_addresses (address_id, item_id, qty) VALUES ($1, $2, $3)", [address_id, item_id, qty]);
      } else if (parseInt(result.rows[0].qty, 10) + qty === 0){
        return client.query("DELETE FROM stock_addresses WHERE address_id = $1 AND item_id = $2", [address_id, item_id]);
      } else {
        return client.query("UPDATE stock_addresses SET qty = qty + $1 WHERE address_id = $2 and item_id = $3", [qty, address_id, item_id]);
      }
    })
    .then(result => {
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
        text: "KO " + error
      })

      })
}

module.exports = assignStock;
