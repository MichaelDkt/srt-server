const { Client } = require('pg');
const client = new Client();

function createStockAddress(store, address, item_id, qty){
  console.log("debut" + store + " " + address);
  client.connect();
  
  // rechercher l'ID de la reserve selon le mag présent dans l'url
  return client.query("SELECT id FROM reserves WHERE store_number = $1",
  [store])

    // rechercher l'id de l'adresse en uuid selon l'adresse en X-aaa et le reserve_id
    .then(result => {
      const reserve_id = result.rows[0].id;
      return client.query("SELECT id FROM addresses WHERE reserve_id = $1 and address = $2",
      [reserve_id, address]);
      })

    // inserer un produit dans une adresse, pour une qté
    .then(result => {
      const address_id = result.rows[0].id;
      console.log(address_id);
      return client.query("INSERT INTO stock_addresses (address_id, item_id, qty) VALUES ($1, $2, $3)",
      [address_id, item_id, qty]);
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
      return({
        code: "400",
        text: "KO " + error
      })
      client.end();
      })
}

module.exports = createStockAddress;
