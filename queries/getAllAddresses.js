const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function getAllAddresses(store, address){
  const client = new Client();
  return getReserveId(store)
    .then(reserve_id => {
      client.connect();
      return client.query("SELECT id, address, disabled, reserve_id FROM addresses WHERE reserve_id = $1 ORDER BY address",
      [reserve_id]);
    })
    .then(result => {
      client.end();
      return result.rows;
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

module.exports = getAllAddresses;
