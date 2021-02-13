const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploaderConfig = require("../configs/configUploader");
const jwt = require("jsonwebtoken");
const configs = require("../configs/configs");

const AddressesController = require("../app/controllers/Shop/AddressController");
const BankAccountController = require("../app/controllers/Shop/BankAccountController");
const EmployeeController = require("../app/controllers/Shop/EmployeeController");
const CashHandlingController = require("../app/controllers/Shop/CashHandlingController");
const ClientControllerShop = require("../app/controllers/Shop/ClientsController");

async function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  await jwt.verify(token, configs.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Usuário sem autorização para esta ação" });
    }
    req.userId = decoded.userId;
    next();
  });
}

//** ROTAS PARA OS ENDEREÇOS */

router.post("/address", verifyToken, AddressesController.Store); //Cadastrar Endereço
router.get("/address/:id", verifyToken, AddressesController.Index); //Buscar Endereços de um cliente específico
router.put("/address/:id", verifyToken, AddressesController.Edit); //Editar um Endereço
router.delete("/address/:id", verifyToken, AddressesController.Remove); //Remover um Endereço

/** ROTAS PARA AS CONTAS BANCARIAS */
router.post("/bankaccount", verifyToken, BankAccountController.Store);
router.get("/bankaccount", verifyToken, BankAccountController.Show);
router.put("/bankaccount/:id", verifyToken, BankAccountController.Edit);
router.put("/blockbankaccount/:id", verifyToken, BankAccountController.Block);

/** ROTAS PARA FUNCIONÁRIOS */
router.post("/employee", verifyToken, EmployeeController.Store);
router.get("/employee", verifyToken, EmployeeController.Show);
router.put("/employee/:id", verifyToken, EmployeeController.Edit);
router.put("/employeepass/:id", verifyToken, EmployeeController.Password);
router.put("/employeeact/:id", verifyToken, EmployeeController.Block);
router.post("/employeeautenticate", EmployeeController.Autenticate);
router.post("/employeelogout", EmployeeController.Logout);

/** MOVIMENTAÇÃO DE CAIXA */
router.post("/cashhandling", verifyToken, CashHandlingController.Stores);
router.get("/cashhandling/:cashier", verifyToken, CashHandlingController.Index);
router.put("/cashhandling/:id", verifyToken, CashHandlingController.Edit);
router.delete("/cashhandling/:id", verifyToken, CashHandlingController.Remove);

/** CLIENTES */
router.post("/clients", verifyToken, ClientControllerShop.Store);

module.exports = router;
