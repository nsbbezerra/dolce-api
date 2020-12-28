const multer = require("multer");
const path = require("path");

module.exports = {
  storageImg: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "img"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "-");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  storageDocs: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "docs"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "-");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
  storageReceipts: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads", "receipt"),
    filename: (req, file, cb) => {
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "-");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
};
