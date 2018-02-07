const { Client } = require('pg');

function getReserveId(store){
  const client = new Client();
  client.connect();
  return client.query("SELECT id FROM reserves WHERE store_number = $1",
  [store])
    .then(result => {
      client.end();
      console.log(result.rows[0].id);
      return result.rows[0].id;
    } )
    .catch(error => {
      console.warn(error);
      client.end();
      return({
        code: "400",
        text: "KO " + error
      });
    })
  ;
}

module.exports = getReserveId;
