const { Client } = require('pg');

function getStores(){
  const client = new Client();
  client.connect();
  return client.query("SELECT * FROM reserves ORDER BY store_number")
  .then(result => {
    client.end();
    return result.rows;
  })
  .catch(error => {
    client.end();
    return({
      code: "400",
      text: "KO " + error
    });
  })
  ;
}

module.exports = getStores;
