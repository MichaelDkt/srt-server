const { Client } = require('pg');
const getStockAdressIdFromAddressID = require ('./getStockAdressIdFromAddressID');
const getReserveId = require ('./getReserveId');



function addToPickingList(address_id, item_id, quantity, email, store) {
  return getReserveId(store)
  .then(reserve_id => {
    return getStockAdressIdFromAddressID(address_id, item_id)
      .then(result => {
        const client = new Client();
        client.connect();
        return client.query(
            "INSERT INTO picking_lists (email, stock_address_id, qty, reserve_id) VALUES ($1, $2, $3, $4)",
            [email, result, quantity, reserve_id]
          )
          .then(result => {
            console.log("success");
            client.end();
            return {
              code: "201",
              text: "OK"
            };
          })
  })
  .catch(error => {
    console.warn(error);
    client.end();
    return {
      code: "400",
      text: "KO " + error
    };
  });
});
}


module.exports = addToPickingList;
