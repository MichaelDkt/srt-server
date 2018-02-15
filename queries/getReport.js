const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function getReport(store){
  const client = new Client();
  return getReserveId(store)
    .then(reserve_id => {
      client.connect();
      return client.query("\
      SELECT sa.id, a.address, a.disabled, sa.item_id, c.item_description, sa.qty \
      FROM addresses AS a \
      LEFT JOIN stock_addresses AS sa ON sa.address_id = a.id \
      LEFT JOIN catalog AS c ON sa.item_id = c.id \
      WHERE a.reserve_id = $1 \
      ORDER BY a.address, sa.item_id \
      ", [reserve_id]);
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

module.exports = getReport;
