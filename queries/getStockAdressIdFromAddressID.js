const { Client } = require('pg');


function getStockAdressIdFromAddressID(adresse_id, item_id) {
  const client = new Client();
  client.connect();
  return client.query("SELECT id FROM stock_addresses WHERE (address_id = $1 and item_id = $2)",
  [adresse_id, item_id])
  .then( result => {
    client.end();
    return (result.rows[0].id);

  })
  .catch(error => {
    console.warn(error);
    client.end();
    return({
      code: "400",
      text: "KO " + error
    });
  })
}

module.exports = getStockAdressIdFromAddressID;
