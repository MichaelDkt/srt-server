const { Client } = require('pg');



function checkAddress(address) {
  console.log(`Adresse à checker : ${address}`);

  const client = new Client();
  client.connect();

  return client.query("SELECT * from addresses where address = $1",[address])
  .then(response => {
    if (response.rows[0] === undefined || !response.rows[0].disabled ) {
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
    console.warn(error);
    return({
      code: "400",
      text: "KO " + error
    })
    client.end();
  })

};



module.exports = checkAddress;
