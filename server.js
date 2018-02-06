const express = require("express");
const fetch = require("node-fetch");
const createAddress = require("./queries/createAddress");

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

app.get("*", function(request, result) {
  result.send("Welcome on SRT API server")
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
