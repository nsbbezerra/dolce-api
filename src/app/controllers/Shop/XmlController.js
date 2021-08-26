const knex = require("../../../database/pg");
const parser = require("fast-xml-parser");
const path = require("path");
const fs = require("fs");
const he = require("he");

async function RemoveXml(url) {
  fs.unlink(url, (err) => {
    if (err) console.log(err);
    else {
      console.log();
    }
  });
}

module.exports = {
  async ReadFile(req, res) {
    const { filename } = req.file;

    try {
      const options = {
        attributeNamePrefix: "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: true,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) =>
          he.decode(val, { isAttributeValue: true }), //default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"],
      };
      const file = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "..",
        "uploads",
        "docs",
        filename
      );
      const readeadFile = fs.readFileSync(file, "utf-8");

      if (parser.validate(readeadFile) === true) {
        const jsonFile = parser.parse(readeadFile, options);
        console.log(jsonFile.nfeProc);
        const NFE = jsonFile.nfeProc.NFe.infNFe;
        const Emitente = NFE?.emit;
        const Destinatario = NFE?.dest;
        const Entrega = NFE?.entrega;
        const Produtos = NFE?.det;
        const Total = NFE?.total;
        const Transporte = NFE?.transp;
        const Chave = jsonFile.nfeProc.protNFe.infProt;

        RemoveXml(file);

        return res.status(201).json({
          Emitente,
          Destinatario,
          Entrega,
          Produtos,
          Total,
          Transporte,
          Chave,
        });
      }

      return res.status(201).json({ message: "Nota Fiscal Inválida" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao carregar o xml",
        errorMessage,
      });
    }
  },
};
