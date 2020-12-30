const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploaderConfig = require("../configs/configUploader");

const AddressesController = require("../app/controllers/AddressController");

//** ROTAS PARA OS ENDEREÇOS */

router.post("/address", AddressesController.Store); //Cadastrar Endereço
router.get("/address/:id", AddressesController.Index); //Buscar Endereços de um cliente específico
router.put("/address/:id", AddressesController.Edit); //Editar um Endereço
router.delete("/address/:id", AddressesController.Remove); //Remover um Endereço

module.exports = router;
