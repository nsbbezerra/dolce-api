const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploaderConfig = require("../configs/configUploader");

const AddressesController = require("../app/controllers/AddressController");
const BankAccountController = require("../app/controllers/BankAccountController");
const EmployeeController = require("../app/controllers/EmployeeController");

//** ROTAS PARA OS ENDEREÇOS */

router.post("/address", AddressesController.Store); //Cadastrar Endereço
router.get("/address/:id", AddressesController.Index); //Buscar Endereços de um cliente específico
router.put("/address/:id", AddressesController.Edit); //Editar um Endereço
router.delete("/address/:id", AddressesController.Remove); //Remover um Endereço

/** ROTAS PARA AS CONTAS BANCARIAS */
router.post("/bankaccount", BankAccountController.Store);
router.get("/bankaccount", BankAccountController.Show);
router.put("/bankaccount/:id", BankAccountController.Edit);
router.put("/blockbankaccount/:id", BankAccountController.Block);

/** ROTAS PARA FUNCIONÁRIOS */
router.post("/employee", EmployeeController.Store);
router.get("/employee", EmployeeController.Show);
router.put("/employee/:id", EmployeeController.Edit);
router.put("/employeepass/:id", EmployeeController.Password);
router.put("/employeeact/:id", EmployeeController.Block);

module.exports = router;
