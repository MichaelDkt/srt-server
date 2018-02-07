const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function modifyQtyPickingList(picking_list_id, qty){

  const client = new Client();
  client.connect();

  return client.query("UPDATE picking_lists SET qty = $1 WHERE id = $2", [qty, picking_list_id])
  .then(result => {
    client.end();
    return({
      code: "200",
      text: "OK"
    });
  })
  .catch(error => {
    client.end();
    return({
      code: "400",
      text: "KO " + error
    })
  })

}

module.exports = modifyQtyPickingList;
