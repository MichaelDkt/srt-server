const { Client } = require('pg');



function checkAddress(address) {


  const client = new Client();
  client.connect();
  return client.query("SELECT * from addresses where address = $1",[address])
  .then(response => {
    if (response.rows[0] === undefined ) {
      client.end();
      return ({
        address : address,
        status : "available"
      })
    } else if (response.rows[0].disabled ) {
      client.end();
      return ({
        address : address,
        status : "blocked location"
      })
    } else {
      return client.query("SELECT * from stock_addresses where address_id = $1",
     [response.rows[0].id])
     .then(response => {
       client.end();
       if (response.rows.length === 0) {
         return ({
           address : address,
           status : "available"
         })
       } else {
         return response.rows.map(element => {
           return ({
             places : response.rowCount,
             item : element.item_id,
             qty : element.qty
           });
         })
       }
     })
    }
  })
  .catch(error => {
    client.end();
    console.warn(error);
    return({
      code: "400",
      text: "KO " + error
    })
  })

};


module.exports = checkAddress;
