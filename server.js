const express = require("express");
const fetch = require("node-fetch");
const getAllAddresses = require("./queries/getAllAddresses");
const createAddress = require("./queries/createAddress");
const assignStock = require("./queries/assignStock");
const deleteAddress = require("./queries/deleteAddress");
const getPickingList = require("./queries/getPickingList");
const modifyQtyPickingList = require("./queries/modifyQtyPickingList");
const getItemDetails = require("./queries/getItemDetails");
const addToPickingList = require("./queries/addToPickingList");
const deletePickingRow = require("./queries/deletePickingRow");
const checkAddress = require("./queries/checkAddress");



const port = process.env.PORT || 4000;
const app = express();

app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));


// to retrieve all the addresses of one store
app.get("/:store/addresses", function(request, result) {
  getAllAddresses(request.params.store)
    .then(response => {
      result.json(response);
    });
});

// Add an address for one store
app.post("/:store/addresses/:address", function(request, result) {
  createAddress(request.params.store, request.params.address)
    .then(response => {
      result.json(response);
    })
  ;
});

// Add an itme to the pickingList
app.post("/:store/pickinglist", function(request, result) {
  addToPickingList(request.body.stock_addresses_id, request.body.qty, request.body.email, request.params.store)
    .then(response => {
      result.json(response);
    });
});


// put an item into an address
// either create a stock , OR update an existing stock
app.put("/:store/addresses/:address", function(request, result) {
  assignStock(request.params.store, request.params.address, request.body.item_id, request.body.qty)
    .then(response => {
      result.json(response);
    });
});

// to delete an address
app.patch("/:store/addresses/:address", function(request, result) {
  deleteAddress(request.params.store, request.params.address, request.body.disabled)
    .then(response => {
      result.json(response);
    });
});

// to retrieve the picking list of 1 email
app.get("/:store/pickingList/:email", function(request, result) {
  getPickingList(request.params.store, request.params.email)
    .then(response => {
      result.json(response);
    });
});

// to modify the qty of one line in this :picking_list_id
app.patch("/:store/pickingList/:picking_list_id", function(request, result) {
  modifyQtyPickingList(request.params.picking_list_id, request.body.qty)
    .then(response => {
      result.json(response);
    });
});

//get infos for a stock item : its description, department, stock positions with quantities and address name
app.get("/:store/items/:item_id", function(request, result){
  getItemDetails(request.params.store, request.params.item_id)
    .then(response => {
      result.json(response);
    })
});

//delete a picking list row without picking it
app.delete("/:store/pickingList/:pickingList_id", function(request, result){
  deletePickingRow(request.params.pickingList_id)
    .then(response => {
      result.json(response);
    })
});

//Check adress status ( available, blocked location, display content)
//pay attention to upper / lower case, with and without the dash
app.get("/:store/addresses/:address", function(request, result){
  checkAddress(request.params.address, request.params.store)
  .then(response => {
    result.json(response);
  })
})



app.get("*", function(request, result) {
  result.send("Welcome on SRT API server")
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
