const multer = require("multer");
const path = require("path");

const img = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "..", "uploads", "img"),
    filename: (req, file, cb) => {
      console.log(file);
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "_");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
};

const docs = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "..", "uploads", "docs"),
    filename: (req, file, cb) => {
      console.log(file);
      let fileName = file.originalname;
      let newName = fileName.replace(/\s/g, "_");
      const ext = path.extname(newName);
      const name = path.basename(newName, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  }),
};

module.exports = { img, docs };
