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
const CashierController = require("../app/controllers/Shop/CashierController");
const ClientControllerShop = require("../app/controllers/Shop/ClientsController");
const DepartmentsControllerShop = require("../app/controllers/Shop/DepartmentsController");
const CategoriesControllerShop = require("../app/controllers/Shop/CategoriesController");
const ProductControllerShop = require("../app/controllers/Shop/ProductsController");
const SizesControllerShop = require("../app/controllers/Shop/SizesController");
const ImageColorsController = require("../app/controllers/Shop/ImageColorsController");
const DetailsControllerShop = require("../app/controllers/Shop/DetailsControllerShop");
const ProvidersController = require("../app/controllers/Shop/ProviderController");
const PlanAccountsControllerShop = require("../app/controllers/Shop/PlanAccountsController");
const PayFormControllerShop = require("../app/controllers/Shop/PayFormControllerShop");
const ChecksController = require("../app/controllers/Shop/CheckController");
const PixController = require("../app/controllers/Shop/PixController");
const ExpensesController = require("../app/controllers/Shop/ExpensesController");
const RevenuesController = require("../app/controllers/Shop/RevenuesController");
const FakerController = require("../app/controllers/Shop/FakerController");
const TagsController = require("../app/controllers/Shop/TagsController");
const SubCatController = require("../app/controllers/Shop/SubCatController");
const OrderControllerShop = require("../app/controllers/Shop/OrdersController");
const PaymentsController = require("../app/controllers/Shop/PaymentController");
const ReportController = require("../app/controllers/Shop/ReportController");
const XmlController = require("../app/controllers/Shop/XmlController");

/** SITE CONTROLLERS */
const HomeController = require("../app/controllers/Web/HomeController");

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

/** CLIENTES SHOP */
router.post("/clients", verifyToken, ClientControllerShop.Store);
router.get("/clients", ClientControllerShop.Show);
router.get("/clientsWithAddress", ClientControllerShop.ShowWithAdress);
router.put("/clients/:id", verifyToken, ClientControllerShop.Update);
router.put("/activeclient/:id", verifyToken, ClientControllerShop.Active);
router.put("/restrictclient/:id", verifyToken, ClientControllerShop.Restrict);

/** DEPARTAMENTOS SHOP */
router.post("/departments", verifyToken, DepartmentsControllerShop.Store);
router.get("/departments", DepartmentsControllerShop.Show);
router.get(
  "/departmentsPagination/:page/:text",
  DepartmentsControllerShop.ShowWithPagination
);
router.put("/departments/:id", verifyToken, DepartmentsControllerShop.Update);
router.put(
  "/activeDepartment/:id",
  verifyToken,
  DepartmentsControllerShop.Activate
);

/** CATEGORIAS SHOP */
router.post("/categories", verifyToken, CategoriesControllerShop.Store);
router.get("/categories", CategoriesControllerShop.Show);
router.get(
  "/categoriesPagination/:page/:text",
  CategoriesControllerShop.ShowWithPagination
);
router.put("/categories/:id", verifyToken, CategoriesControllerShop.Update);
router.put("/activeCategory/:id", verifyToken, CategoriesControllerShop.Active);
router.get(
  "/findCatByDepartments/:id",
  CategoriesControllerShop.FindByDepartment
);

/** PRODUCTS SHOP */
router.get("/products/:page/:find/:name", ProductControllerShop.Show);
router.get(
  "/productsPdv/:page/:name/:sku/:barcode",
  ProductControllerShop.ShowPdv
);
router.get("/findProducts", ProductControllerShop.FindProducts);
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
router.put(
  "/updateInfoAndList/:id",
  verifyToken,
  ProductControllerShop.UpdateInfoAndList
);

/** SIZES SHOP */
router.get("/sizes", SizesControllerShop.Show);
router.get("/sizeByProduct/:id", SizesControllerShop.ShowByProduct);
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
router.get("/findImages/:id", ImageColorsController.Find);

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
router.get("/payFormPdv", PayFormControllerShop.ShowPdv);
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
router.get("/expenses/:find/:init/:final", ExpensesController.Find);
router.put("/expenses/:id", verifyToken, ExpensesController.UpdateInfo);
router.put(
  "/expenseChangeStatus/:id",
  verifyToken,
  ExpensesController.UpdateStatus
);
router.put(
  "/expenseChangeMovimentation/:id",
  verifyToken,
  ExpensesController.UpdateMovimentation
);
router.delete("/expenses/:id", verifyToken, ExpensesController.Remove);

/** CONTAS A RECEBER */
router.get("/revenuesDependets", RevenuesController.Dependents);
router.post("/revenues", verifyToken, RevenuesController.Store);
router.get("/revenues/:find/:init/:final", RevenuesController.Find);
router.put("/revenues/:id", verifyToken, RevenuesController.UpdateInfo);
router.put(
  "/revenueChangeStatus/:id",
  verifyToken,
  RevenuesController.UpdateStatus
);
router.put(
  "/revenueChangeMovimentation/:id",
  verifyToken,
  RevenuesController.UpdateMovimentation
);
router.delete("/revenues/:id", verifyToken, RevenuesController.Remove);

/** CAIXA */
router.get("/cashier/:find/:init/:final", CashierController.Find);
router.post("/cashier", verifyToken, CashierController.Open);
router.get("/findOrdersCashier/:page", CashierController.FindOrders);
router.put("/finalizeOrder/:order", verifyToken, CashierController.FinishOrder);
router.get("/cashierMoviment/:cash", CashierController.Moviment);
router.put("/closeCashier/:cash", verifyToken, CashierController.CloseCashier);

/** TAGS */
router.post("/tags", verifyToken, TagsController.Store);
router.put(
  "/tags/:id",
  multer(uploaderConfig.img).single("banner"),
  verifyToken,
  TagsController.StoreBanner
);
router.get("/findActiveTags", TagsController.FindActive);
router.get("/tags", TagsController.Find);
router.put("/updateTagInfo/:id", verifyToken, TagsController.UpdateInfo);
router.put(
  "/updateTagBanner/:id",
  multer(uploaderConfig.img).single("banner"),
  verifyToken,
  TagsController.UpdateBanner
);

/** SUB-CATEGORIES */
router.post("/subCat", verifyToken, SubCatController.Store);
router.get("/subCat/:category", SubCatController.Find);
router.get("/findSubCat", SubCatController.Show);
router.get(
  "/subCatPagination/:page/:text",
  SubCatController.ShowWithPagination
);
router.put("/activeSubCat/:id", verifyToken, SubCatController.Active);
router.put("/subCat/:id", verifyToken, SubCatController.Edit);

/** ORDERS */
router.post("/order", verifyToken, OrderControllerShop.Store);
router.post("/budget", verifyToken, OrderControllerShop.StoreWithBudget);
router.get("/findBudget", OrderControllerShop.FindBudget);
router.put(
  "/convertToBudget/:id",
  verifyToken,
  OrderControllerShop.ConvertOrderToBudget
);

/** CASH HANDLING */
router.post("/cashHandling", verifyToken, CashHandlingController.Handling);

/** PAYMENTS */
router.post("/payments", verifyToken, PaymentsController.Store);
router.get(
  "/findPaymentsByOrder/:order",
  PaymentsController.FindPaymentsByOrders
);
router.delete(
  "/delPaymentsByOrder/:order",
  verifyToken,
  PaymentsController.DelPaymentsByOrder
);

/** REPORT CONTROLLER */
router.get("/reportOrder/:id", ReportController.OrderReport);
router.get("/cashierReport/:cash", ReportController.CashierReport);

/** XML IMPORTER */
router.post(
  "/xmlimporter",
  multer(uploaderConfig.docs).single("xml"),
  XmlController.ReadFile
);

/** FAKER */
router.post("/fakeDepartments", FakerController.StoreDepartments);
router.post("/fakerCategory", FakerController.StoreCategory);
router.post("/fakerProducts", FakerController.StoreProducts);
router.post("/fakerSubCat", FakerController.StoreSubCat);

/** SITE ROUTES */

/** HOME */
router.get("/home", HomeController.Home);
router.get("/homeProducts/:find/:cats/:page", HomeController.HomeProducts);
router.get("/productsPage", HomeController.ProductsPage);
router.get("/findByParams/:identify", HomeController.FindByParams);
router.get("/findSizesAndImages/:identify", HomeController.FindSizesAndImages);

module.exports = router;
