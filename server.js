const express = require("express");
const fetch = require("node-fetch");
const createAddress = require("./queries/createAddress");
const assignStock = require("./queries/assignStock");
const deleteAddress = require("./queries/deleteAddress");
const getPickingList = require("./queries/getPickingList");
const modifyQtyPickingList = require("./queries/modifyQtyPickingList");

const port = process.env.PORT || 4000;
const app = express();

app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));

app.post("/addresses", function(request, result) {
  createAddress(request.body.store, request.body.address)
    .then(response => {
      result.json(response);
    })
  ;
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
app.delete("/:store/addresses/:address", function(request, result) {
  deleteAddress(request.params.store, request.params.address)
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

app.get("*", function(request, result) {
  result.send("Welcome on SRT API server")
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
