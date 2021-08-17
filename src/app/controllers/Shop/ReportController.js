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

  async CashierReport(req, res) {
    const { cash } = req.params;

    try {
      const payForms = await knex.select("*").from("payForm");
      let payFormsReport = [];
      const orders = await knex
        .select([
          "orders.id",
          "orders.order_date",
          "orders.grand_total",
          "orders.discount",
          "orders.total_to_pay",
          "orders.products",
          "orders.payment_info",
          "clients.id as client_id",
          "clients.name as client_name",
        ])
        .from("orders")
        .where({ cashier_id: cash })
        .innerJoin("clients", "clients.id", "orders.client_id")
        .orderBy("orders.order_date");
      const cashier = await knex
        .select([
          "cashier.id",
          "cashier.status",
          "cashier.open_date",
          "cashier.open_value",
          "cashier.close_date",
          "cashier.close_value",
          "employees.id as employee_id",
          "employees.name as employee_name",
        ])
        .from("cashier")
        .where("cashier.id", cash)
        .innerJoin("employees", "employees.id", "cashier.employee_id")
        .first();
      const payments = await knex
        .select("*")
        .from("payments")
        .where({ cashier_id: cash });

      async function calculate(payform, payment) {
        let valor = payment.reduce(
          (total, numeros) => total + parseFloat(numeros.value),
          0
        );
        let info = { id: uniqid(), pay_form: payform.name, value: valor };
        payFormsReport.push(info);
      }

      await payForms.forEach((pay) => {
        const result = payments.filter((obj) => obj.payForm_id === pay.id);
        calculate(pay, result);
      });

      const revenues = await knex
        .select("*")
        .from("cashierMov")
        .where({ cashier_id: cash, type: "deposit" })
        .orderBy("created_at");
      const expenses = await knex
        .select("*")
        .from("cashierMov")
        .where({ cashier_id: cash, type: "withdraw" })
        .orderBy("created_at");

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
      return res.status(400).json({
        message: "Ocorreu um erro ao gerar o relatório",
        errorMessage,
      });
    }
  },
};
