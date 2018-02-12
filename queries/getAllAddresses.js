const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function getAllAddresses(store, address){
  const client = new Client();
  return getReserveId(store)
    .then(reserve_id => {
      client.connect();
      return client.query("\
      SELECT a.id, a.address, a.disabled, a.reserve_id, count(sa.id) AS qty_ref, \
      CASE WHEN SUM(sa.qty) ISNULL THEN 0 ELSE SUM(sa.qty) END AS stock_total  \
      FROM addresses AS a LEFT JOIN stock_addresses AS sa ON sa.address_id = a.id \
      WHERE reserve_id = $1 \
      GROUP BY a.id, a.address, a.disabled, a.reserve_id \
      ORDER BY address",
      [reserve_id]);
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

module.exports = getAllAddresses;
