const { Client } = require('pg');
const getReserveId = require("./getReserveId");


function checkAddress(address, store) {
  let response_id;

  const client = new Client();
  client.connect();
  return getReserveId(store)
  .then(reserve_id => client.query("SELECT * from addresses where address = $1 AND reserve_id = $2",[address, reserve_id]))
  .then(response => {
    if (response.rows[0] === undefined ) {
      client.end();
      return ({
        address : address,
        disabled: false,
        exists : false
      })
    } else if (response.rows[0].disabled ) {
      client.end();
      return ({
        address : address,
        address_id : response.rows[0].id,
        disabled: true,
        exists : true
      })
    } else {
      response_id = response.rows[0].id;
      return client.query("SELECT * from stock_addresses where address_id = $1",
     [response.rows[0].id])
     .then(response => {
       client.end();
       if (response.rows.length === 0) {
         return ({
           address : address,
           address_id : response_id,
           disabled: false,
           exists : true,
           stock : []
         })
       } else {
         return {
           address : address,
           address_id : response_id,
           disabled : false,
           exists : true,
           stock : response.rows.map(element => {
             return ({
               item : element.item_id,
               qty : element.qty
             });
           })
         }
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
