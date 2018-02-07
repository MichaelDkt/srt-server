const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function deleteAddress(store, address){

  const client = new Client();
  client.connect();

  let reserve_id;

  return getReserveId(store)

    // check if there are some items in this address before to delete it.
    .then(reserve_id => {
      return client.query("SELECT count(*) FROM stock_addresses WHERE address_id = $1", [address])
    })

    // if there are some items in this address, no delete.
    .then(result => {

      if (result.rows[0].count === '0'){

        return client.query("UPDATE addresses SET disabled = true WHERE id = $1",[address])
        .then( result => {
          client.end();
          return({
            code: "200",
            text: "OK"
          });
        });

      } else {

        return({
          code: "400",
          text: "There are some items in this address. Impossible to delete it."
        });

      }
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

module.exports = deleteAddress;
