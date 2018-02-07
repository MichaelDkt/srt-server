const { Client } = require('pg');

function getPickingList(store, email){
  const client = new Client();
  client.connect();
  return client.query("\
  SELECT pl.id as id_picking_list, a.address, pl.qty, c.id as item_code, c.item_description \
  FROM picking_lists AS pl JOIN stock_addresses AS sa ON pl.stock_address_id = sa.id \
  JOIN addresses AS a ON a.id = sa.address_id \
  JOIN catalog as c on c.id = sa.item_id \
  WHERE pl.email = $1",[email])
  .then(result => {
    client.end();
    return result.rows;
  } )
  .catch(error => {
    client.end();
    return({
      code: "400",
      text: "KO " + error
    });
  })
  ;
}

module.exports = getPickingList;
