const { Client } = require('pg');

function getDepartment(){
  const client = new Client();
  client.connect();
  return client.query("SELECT DISTINCT department_description FROM catalog ORDER BY department_description")
  .then(result => {
    client.end();
    return result.rows;
  })
  .catch(error => {
    client.end();
    return({
      code: "400",
      text: "KO " + error
    });
  })
  ;
}

module.exports = getDepartment;
