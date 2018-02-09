const { Client } = require('pg');
const getReserveId = require("./getReserveId");

function getItemFromCatalog(item_id){
  const client = new Client();
  client.connect();
  return client.query("SELECT * FROM catalog WHERE id=$1",
    [item_id])
    .then(result => {
      client.end();
      return result.rows[0];
    })
    .catch(error => {
      console.warn("Error while getting products infos from Catalog");
      client.end();
      return({
        code: "400",
        text: "KO " + error
      });
    })
    ;
}

function getItemStockPositions(store, item_id){
  const client = new Client();
  client.connect();
  return getReserveId(store)
    .then(reserve_id => {
      return client.query("SELECT * FROM stock_addresses WHERE item_id=$1 AND address_id IN (SELECT id FROM addresses WHERE reserve_id = $2)",
      [item_id, reserve_id]
      )
    })
    .then(result => {
      client.end();
      return result.rows;
    })
    .catch(error => {
      console.warn("Error while getting stock positions for product");
      client.end();
      return({
        code: "400",
        text: "KO " + error
      });
    })
    ;
}

function getAddressName(address_id){
  const client = new Client();
  client.connect();
  return client.query("SELECT address from addresses WHERE id=$1",
    [address_id])
    .then(result => {
      client.end();
      return result.rows[0].address;
    })
    .catch(error => {
      console.warn("Error while getting address name from address id " + address_id);
      client.end();
      return({
        code: "400",
        text: "KO " + error
      })
    });
}

function getItemDetails(store, item_id){
  let data;
  return Promise.all([getItemFromCatalog(item_id), getItemStockPositions(store, item_id)])
    .then(([catalogResults, stockPositionsResult]) => {
      data = catalogResults;
      return Promise.all(stockPositionsResult.map(element => {
        return getAddressName(element.address_id)
          .then(address => {
            return {
              ...element,
              address: address
            }
          })
      }))})
    .then(stock => {
      function compare(a,b) {
        if (a.address < b.address)
          return -1;
        if (a.address > b.address)
          return 1;
        return 0;
      }
      stock.sort(compare);

      if(data === undefined){
        return {
          item_id: "page",
          item_description: `${item_id} does not exist`,
          department_description: "",
          stock: []
        };
      } else {
        return {
          item_id: data.id,
          item_description: data.item_description,
          department_description: data.department_description,
          stock: stock
        };
      }
    })
  ;
}

module.exports = getItemDetails;
