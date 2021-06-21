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
const DepartmentsControllerShop = require("../app/controllers/Shop/DepartmentsController");
const CategoriesControllerShop = require("../app/controllers/Shop/CategoriesController");
const ProductControllerShop = require("../app/controllers/Shop/ProductsController");
const ColorsControllerShop = require("../app/controllers/Shop/ColorsController");
const SizesControllerShop = require("../app/controllers/Shop/SizesController");
const ImageColorsController = require("../app/controllers/Shop/ImageColorsController");
const DetailsControllerShop = require("../app/controllers/Shop/DetailsControllerShop");
const ProvidersController = require("../app/controllers/Shop/ProviderController");
const PlanAccountsControllerShop = require("../app/controllers/Shop/PlanAccountsController");
const PayFormControllerShop = require("../app/controllers/Shop/PayFormControllerShop");
const ChecksController = require("../app/controllers/Shop/CheckController");
const PixController = require("../app/controllers/Shop/PixController");
const ExpensesController = require("../app/controllers/Shop/ExpensesController");

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
router.get("/address/:id", AddressesController.Index); //Buscar Endereços de um cliente específico
router.put("/address/:id", verifyToken, AddressesController.Edit); //Editar um Endereço
router.delete("/address/:id", verifyToken, AddressesController.Remove); //Remover um Endereço

/** ROTAS PARA AS CONTAS BANCARIAS */
router.post(
  "/accountbank",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  BankAccountController.Store
);
router.get("/accountbank", BankAccountController.Show);
router.put("/accountbank/:id", verifyToken, BankAccountController.Update);
router.put("/activebankaccount/:id", verifyToken, BankAccountController.Active);
router.put(
  "/imagebankaccount/:id",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  BankAccountController.UpdateImage
);

/** ROTAS PARA FUNCIONÁRIOS */
router.post("/employee", verifyToken, EmployeeController.Store);
router.get("/employee", EmployeeController.Show);
router.put("/employee/:id", verifyToken, EmployeeController.Edit);
router.put("/employeeact/:id", verifyToken, EmployeeController.Block);
router.post("/employeeautenticate", EmployeeController.Autenticate);
router.put("/geremployee/:id", verifyToken, EmployeeController.Permissions);
router.put("/comission/:id", verifyToken, EmployeeController.Comission);

/** MOVIMENTAÇÃO DE CAIXA */
router.post("/cashhandling", verifyToken, CashHandlingController.Stores);
router.get("/cashhandling/:cashier", verifyToken, CashHandlingController.Index);
router.put("/cashhandling/:id", verifyToken, CashHandlingController.Edit);
router.delete("/cashhandling/:id", verifyToken, CashHandlingController.Remove);

/** CLIENTES SHOP */
router.post("/clients", verifyToken, ClientControllerShop.Store);
router.get("/clients", ClientControllerShop.Show);
router.put("/clients/:id", verifyToken, ClientControllerShop.Update);
router.put("/activeclient/:id", verifyToken, ClientControllerShop.Active);
router.put("/restrictclient/:id", verifyToken, ClientControllerShop.Restrict);

/** DEPARTAMENTOS SHOP */
router.post("/departments", verifyToken, DepartmentsControllerShop.Store);
router.get("/departments", DepartmentsControllerShop.Show);
router.put("/departments/:id", verifyToken, DepartmentsControllerShop.Update);
router.put(
  "/activeDepartment/:id",
  verifyToken,
  DepartmentsControllerShop.Activate
);

/** CATEGORIAS SHOP */
router.post("/categories", verifyToken, CategoriesControllerShop.Store);
router.get("/categories", CategoriesControllerShop.Show);
router.put("/categories/:id", verifyToken, CategoriesControllerShop.Update);
router.put("/activeCategory/:id", verifyToken, CategoriesControllerShop.Active);

/** PRODUCTS SHOP */
router.get("/products", ProductControllerShop.Show);
router.get("/findDependents", ProductControllerShop.FindAllDependets);
router.post(
  "/products",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  ProductControllerShop.Store
);
router.put(
  "/productChangeImage/:id",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  ProductControllerShop.UpdateImage
);
router.put("/products/:id", verifyToken, ProductControllerShop.Update);
router.put(
  "/setPromotional/:id",
  verifyToken,
  ProductControllerShop.SetPromotional
);
router.put("/productsActive/:id", verifyToken, ProductControllerShop.Active);
router.put("/updateStock/:id", verifyToken, ProductControllerShop.UpdateStock);

/** COLORS SHOP */
router.get("/colors", ColorsControllerShop.Show);
router.post("/colors", verifyToken, ColorsControllerShop.Store);
router.get("/colorsGet/:id", ColorsControllerShop.Find);
router.put("/colors/:id", verifyToken, ColorsControllerShop.Update);
router.delete("/colors/:id", verifyToken, ColorsControllerShop.Remove);
router.get("/colorDependents", ColorsControllerShop.FindProducts);

/** SIZES SHOP */
router.get("/sizes", SizesControllerShop.Show);
router.post("/sizes", verifyToken, SizesControllerShop.Store);
router.put("/sizes/:id", verifyToken, SizesControllerShop.Update);
router.delete("/sizes/:id", verifyToken, SizesControllerShop.Remove);
router.get("/sizeDependets/:product", SizesControllerShop.FindDependents);
router.get("/findSize/:color", SizesControllerShop.Find);
router.get("/findSizeByProduct/:product", SizesControllerShop.FindByProducts);

/** IMAGES COLORS SHOP */
router.get("/imageColors", ImageColorsController.Show);
router.post(
  "/imageColors",
  multer(uploaderConfig.img).single("image"),
  verifyToken,
  ImageColorsController.Store
);
router.get("/imagesDependets/:product", ImageColorsController.FindDependents);
router.delete("/imageColors/:id", verifyToken, ImageColorsController.Remove);
router.get("/findImages/:color", ImageColorsController.Find);

/** DETALHES DO PRODUTO SHOP */
router.get("/details/:product", DetailsControllerShop.Find);
router.post("/details", verifyToken, DetailsControllerShop.Store);
router.put("/details/:id", verifyToken, DetailsControllerShop.Update);
router.delete("/details/:id", verifyToken, DetailsControllerShop.Remove);

/** ROTA PARA OS FORNECEDORES */
router.post(
  "/providers",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  ProvidersController.Store
);
router.put(
  "/changeProviderImage/:id",
  multer(uploaderConfig.img).single("thumbnail"),
  verifyToken,
  ProvidersController.UpdateImage
);
router.get("/providers", ProvidersController.Show);
router.put("/providers/:id", verifyToken, ProvidersController.Update);
router.put("/providerActive/:id", verifyToken, ProvidersController.Active);

/** PLANO DE CONTAS */

router.get("/planAccount", PlanAccountsControllerShop.Show);
router.post("/planAccount", verifyToken, PlanAccountsControllerShop.Store);
router.put("/planAccount/:id", verifyToken, PlanAccountsControllerShop.Update);
router.put(
  "/planAccountActive/:id",
  verifyToken,
  PlanAccountsControllerShop.Active
);

/** FORMAS DE PAGAMENTO */

router.get("/payForm", PayFormControllerShop.Show);
router.post("/payForm", verifyToken, PayFormControllerShop.Store);
router.put("/payForm/:id", verifyToken, PayFormControllerShop.Update);
router.put(
  "/showOnSitePayForm/:id",
  verifyToken,
  PayFormControllerShop.ShowOnSite
);

/** CHEQUES */

router.post("/checks", verifyToken, ChecksController.Store);
router.get("/checks", ChecksController.Show);
router.delete("/checks/:id", verifyToken, ChecksController.Remove);
router.put("/situation/:id", verifyToken, ChecksController.Situation);
router.put("/stats/:id", verifyToken, ChecksController.Status);

/** PIX */
router.post("/pix", verifyToken, PixController.Store);
router.delete("/pix/:id", verifyToken, PixController.Remove);
router.get("/pix", PixController.Show);

/** CONTAS A PAGAR */
router.get("/expensesDependets", ExpensesController.Dependents);
router.post("/expenses", verifyToken, ExpensesController.Store);
router.get("/expenses/:find", ExpensesController.Find);

module.exports = router;
