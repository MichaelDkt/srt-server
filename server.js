const express = require("express");
const fetch = require("node-fetch");

const port = process.env.PORT || 4000;
const app = express();

app.get("*", function(request, result) {
  result.send("Welcome on SRT API server")
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
