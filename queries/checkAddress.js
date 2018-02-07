const { Client } = require('pg');



function checkAddress(address) {


  const client = new Client();
  client.connect();

  return client.query("SELECT * from addresses where address = $1",[address])
  .then(response => {
    if (response.rows[0] === undefined || !response.rows[0].disabled ) {
      console.log(response.rows[0]);
      client.end();
      return ({
        address : address,
        status : "available"
      })
    } else if (response.rows[0].disabled ) {
      client.end();
      return ({
        address : address,
        status : "disabled"
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
