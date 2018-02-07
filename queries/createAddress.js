const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function createAddress(store, address){
  const client = new Client();
  return getReserveId(store)
    .then(reserve_id => {
      client.connect();
      return client.query("INSERT INTO addresses (address, disabled, reserve_id) VALUES ($1, false, $2)",
      [address, reserve_id]);
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
      });
    });
}

module.exports = createAddress;
