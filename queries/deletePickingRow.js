const { Client } = require('pg');

function deletePickingRow(pickingList_id){
  const client = new Client();
  client.connect();
  return client.query("DELETE FROM picking_lists WHERE id=$1",
    [pickingList_id])
    .then(result => {
      client.end();
      return({
        code: "200",
        text: "OK"
      });
    })
    .catch(error => {
      console.warn(error);
      client.end();
      return({
        code: "400",
        text: "Error while deleting"
      });
    })
    ;
}

module.exports = deletePickingRow;
