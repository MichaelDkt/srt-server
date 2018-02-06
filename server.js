const express = require("express");
const fetch = require("node-fetch");

const port = process.env.PORT || 3001;
const app = express();


app.get("/api", function(request, result) {
  result.send("Hello");
});


app.use("/static", express.static('./srt_react/build/static'));

app.get("*", function(request, result) {
  result.sendFile(__dirname + '/srt_react/build/index.html')
});

app.listen(port, function () {
  console.log("Server listening on port:" + port);
});
