const { Client } = require('pg');

function getItemDetails(store, item_id){
  const client = new Client();
  client.connect();
  
}

module.exports = getItemDetails;
