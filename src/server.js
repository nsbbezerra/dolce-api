require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
const routes = require("./routes/routes");
const InitialController = require("./app/controllers/Shop/InitController");
const { version } = require("../package.json");

const app = express();

app.use(express.json());
app.use(bodyparser.json({ limit: "20mb" }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());
app.use(routes);
app.use(
  "/imagem",
  express.static(path.resolve(__dirname, "..", "..", "uploads", "img"))
);
app.use(
  "/documentos",
  express.static(path.resolve(__dirname, "..", "..", "uploads", "docs"))
);
app.use(
  "/comprovantes",
  express.static(path.resolve(__dirname, "..", "..", "uploads", "receipt"))
);

const port = process.env.PORT || 3333;

app.listen(port, function () {
  console.log("App running in port", port, `Versão: ${version}`);
  InitialController.InitialController();
});
