const { Client } =require ('pg');


function getStoreNumberFromReserve_id(reserve_id) {
  const client = new Client();
  client.connect();
  return client.query("SELECT store_number FROM reserves WHERE id = $1",
  [reserve_id])
  .then (response => {
    return(response.rows[0].store_number);
  })
}


module.exports = getStoreNumberFromReserve_id;
