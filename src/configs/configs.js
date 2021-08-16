const baseUrl = "http://localhost:3333";
module.exports = {
  urlImage: `${baseUrl}/img`,
  docsImage: `${baseUrl}/docs`,
  receiptImage: `${baseUrl}/pdf`,
  secret: "dolceapi",
  userPass: "admin",
  fonts: {
    Courier: {
      normal: "Courier",
      bold: "Courier-Bold",
      italics: "Courier-Oblique",
      bolditalics: "Courier-BoldOblique",
    },
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic",
    },
    Symbol: {
      normal: "Symbol",
    },
    ZapfDingbats: {
      normal: "ZapfDingbats",
    },
  },
};
