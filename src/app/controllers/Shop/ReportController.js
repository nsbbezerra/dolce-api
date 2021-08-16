const knex = require("../../../database/pg");
const PDFPrinter = require("pdfmake");
const { fonts } = require("../../../configs/configs");

module.exports = {
  async OrderReport(req, res) {
    const { id } = req.params;

    try {
      const order = await knex
        .select("*")
        .from("orders")
        .where({ id: id })
        .first();
      const clientAddress = await knex
        .select("*")
        .from("addresses")
        .where({ client_id: order.client_id })
        .first();

      const printer = new PDFPrinter(fonts);
      const docsDefinitions = {
        defaultStyle: { font: "Helvetica" },
        pageMargins: [30, 30, 30, 30],
        content: [
          { text: "DOLCE ENCANTO", style: "header" },
          {
            text: "Rua 34, Qd 14 Lt 15, 173, Loteamento Canavieiras, CEP: 77710-000, Pedro Afonso-TO",
            style: "textCenter",
          },
          {
            text: "CNPJ: 04.400.848/1000-33",
            style: "textCenter",
          },
          {
            text: "Fone: (63) 99971-1716",
            style: "textCenter",
          },
          {
            text: "Email: nsbbezerra@hotmail.com",
            style: "textCenter",
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 535,
                y2: 5,
                lineWidth: 0.5,
              },
            ],
          },
          {
            layout: "lightHorizontalLines", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", "*"],

              body: [
                [
                  {
                    text: "Pedido nº: 1",
                    bold: true,
                    margin: [1, 5],
                  },
                  {
                    text: "Data: 10/01/1090",
                    alignment: "right",
                    margin: [1, 5],
                    fontSize: 10,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", "*"],

              body: [
                [
                  {
                    text: "Cliente: Natanael dos Santos Bezerra",
                    margin: [1, 1],
                    fontSize: 9,
                  },
                  {
                    text: "Fone: (63) 99971-1716",
                    alignment: "right",
                    margin: [1, 1],
                    fontSize: 9,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*"],

              body: [
                [
                  {
                    text: "Endereço: Rua 34, Qd 14 Lt 15, 173, Loteamento Canavieiras, CEP: 77710-000, Pedro Afonso-TO",
                    margin: [1, 1],
                    fontSize: 9,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders", // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*"],

              body: [
                [
                  {
                    text: "Vendedor: Natanael dos Santos Bezerra",
                    margin: [1, 1],
                    fontSize: 9,
                  },
                ],
              ],
            },
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 5,
                x2: 535,
                y2: 5,
                lineWidth: 0.5,
              },
            ],
          },
        ],
        styles: {
          header: {
            fontSize: 17,
            bold: true,
            alignment: "center",
            lineHeight: 1.5,
          },
          textCenter: {
            fontSize: 9,
            alignment: "center",
            lineHeight: 1.5,
          },
        },
      };

      const pdfDoc = printer.createPdfKitDocument(docsDefinitions);

      const chuncks = [];
      pdfDoc.on("data", (chunck) => {
        chuncks.push(chunck);
      });
      pdfDoc.end();

      pdfDoc.on("end", () => {
        const results = Buffer.concat(chuncks);
        res.end(results);
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao gerar o relatório",
        errorMessage,
      });
    }
  },
};
