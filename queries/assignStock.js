const { Client } = require('pg');



// cette fonction met du stock dans une adresse.
// si il exite du stock dans cette adresse pour ce produit : mise à jour du stock
// si il n'existe pas de stock à cette adresse pour ce produit : création d'une ligne de stock
function assignStock(store, address, item_id, qty){

  const client = new Client();
  let address_id;

  client.connect();

  // rechercher l'ID de la reserve selon le mag présent dans l'url
  return client.query("SELECT id FROM reserves WHERE store_number = $1", [store])

    // rechercher l'id de l'adresse en uuid selon l'adresse en X-aaa et le reserve_id
    .then(result => {
      const reserve_id = result.rows[0].id;
      return client.query("SELECT id FROM addresses WHERE reserve_id = $1 and address = $2", [reserve_id, address]);
    })

    // verifier si ce code article est déjà présent dans l'adresse uuid
    .then(result => {
      address_id = result.rows[0].id;
      return client.query("SELECT address_id, count(*) FROM stock_addresses WHERE address_id = $1 and item_id = $2 group by address_id", [address_id, item_id])
    })

    // inserer un produit dans une adresse, pour une qté
    .then(result => {
      if (result.rows.length === 0){
        return client.query("INSERT INTO stock_addresses (address_id, item_id, qty) VALUES ($1, $2, $3)", [address_id, item_id, qty]);
      } else {
        return client.query("UPDATE stock_addresses SET qty = qty + $1 WHERE address_id = $2 and item_id = $3", [qty, address_id, item_id]);
      }

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

module.exports = assignStock;
