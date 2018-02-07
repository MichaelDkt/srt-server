const { Client } = require('pg');
const client = new Client();

const getReserveId = require("./getReserveId");

function deleteAddress(store, address){

  client.connect();


  return getReserveId(store)
    .then(reserve_id => {
      return client.query("UPDATE addresses SET disabled = true WHERE id = $1 AND reserve_id = $2",[address, reserve_id]);
    })
    .then(result => {
      client.end();
      return({
        code: "200",
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

module.exports = createAddress;
