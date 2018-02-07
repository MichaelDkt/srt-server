const express = require("express");
const fetch = require("node-fetch");
const createAddress = require("./queries/createAddress");
const assignStock = require("./queries/assignStock");
const deleteAddress = require("./queries/deleteAddress");

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
    })
  ;
});

app.get("*", function(request, result) {
  result.send("Welcome on SRT API server")
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
