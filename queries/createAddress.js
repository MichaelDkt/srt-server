const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function createAddress(store, address){
  const client = new Client();
  let reserve_id;
  let msg;
  let code;

  return getReserveId(store)
    .then(result => {
      reserve_id = result;
      client.connect();
      // check if this address is known or not for this store
      return client.query("SELECT count(*) FROM ADDRESSES WHERE address = $1 AND reserve_id = $2", [address,reserve_id]);
    })
    .then(result => {
      if (result.rows[0].count === "0"){
        msg = "OK";
        code = "201";
        return client.query("INSERT INTO addresses (address, disabled, reserve_id) VALUES ($1, false, $2)", [address, reserve_id]);
      } else {
        //@todo : comment renvoyer un message vers react ? demander vincent si c'est la bonne tactique
        msg = "This address already exists";
        code = "400";
      }
    })
    .then(result => {
      client.end();
      return({
        code: code,
        text: msg
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
