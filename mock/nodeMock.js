const express = require("express");
const app = express();
  app.get("/demo/demo2",function (req,res) {
    res.json({
      a:"aaaaa"
    })
  });
  app.listen(3338);

