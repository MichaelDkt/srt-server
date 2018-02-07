const { Client } = require('pg');
const client = new Client();

function createAddress(store, address){
  console.log("debut" + store + " " + address);
  client.connect();
  return client.query("SELECT id FROM reserves WHERE store_number = $1",
  [store])
    .then(result => {
      const reserve_id = result.rows[0].id;
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
    })

  })
}

module.exports = createAddress;
