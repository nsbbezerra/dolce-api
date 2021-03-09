const multer = require("multer");
const path = require("path");
const { MulterAzureStorage } = require("multer-azure-blob-storage");

const azureDepartmentStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "departments",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

const azureCategoriesStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "categories",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

const azureProductsStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "products",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

const azureColorsStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "colors",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

const azureProviderStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "providers",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

const azureBankStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: "bank",
  containerAccessLevel: "blob",
  urlExpirationTime: 60,
});

module.exports = {
  storageImg: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "img"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "_");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  storageDocs: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "docs"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "_");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  storageReceipts: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "receipt"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "_");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  azureDepartmentsImage: multer({ storage: azureDepartmentStorage }),
  azureCategoriesImage: multer({ storage: azureCategoriesStorage }),
  azureProductsImage: multer({ storage: azureProductsStorage }),
  azureColorsImage: multer({ storage: azureColorsStorage }),
  azureProvidersImage: multer({ storage: azureProviderStorage }),
  azureBankImage: multer({ storage: azureBankStorage }),
};
