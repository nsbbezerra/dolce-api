const multer = require("multer");
const path = require("path");
const { MulterAzureStorage } = require("multer-azure-blob-storage");

const azureDepartmentStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_CONNECTION,
  accessKey: process.env.AZURE_KEY,
  accountName: process.env.AZURE_ACCOUNT_NAME,
  containerName: "departments",
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
};
