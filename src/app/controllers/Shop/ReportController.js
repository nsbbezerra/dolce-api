const knex = require("../../../database/pg");
const PDFPrinter = require("pdfmake");
const { fonts } = require("../../../configs/configs");
const moment = require("moment");

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
        let info = { pay_form: payform.name, value: valor };
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

      let valorRevenues = revenues.reduce(
        (total, numeros) => total + parseFloat(numeros.value),
        0
      );

      let valorExpenses = expenses.reduce(
        (total, numeros) => total + parseFloat(numeros.value),
        0
      );

      const printer = new PDFPrinter(fonts);

      let columnsTitle = [
        {
          text: "Nº",
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
          bold: true,
        },
        {
          text: "Cliente",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
        },
        {
          text: "Valor Total",
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
          bold: true,
        },
        {
          text: "Desconto",
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
          bold: true,
        },
        {
          text: "Total a Pagar",
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
          bold: true,
        },
        {
          text: "Data",
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
          bold: true,
        },
      ];
      let columnsTitleMoviment = [
        {
          text: "Descrição",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
        },
        {
          text: "Data",
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
          bold: true,
        },
        {
          text: "Valor",
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
          bold: true,
        },
      ];
      let columnsTitleMovimentWithDraw = [
        {
          text: "Descrição",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
        },
        {
          text: "Data",
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
          bold: true,
        },
        {
          text: "Valor",
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
          bold: true,
        },
      ];
      let columnsTitleResume = [
        { text: "Descrição", margin: [1, 1], fontSize: 8, bold: true },
        {
          text: "Vencimento",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
          alignment: "center",
        },
        {
          text: "Valor",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
          alignment: "right",
        },
        {
          text: "Status",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
          alignment: "right",
        },
      ];
      let columnsTitleResumeFinal = [
        { text: "Descrição", margin: [1, 1], fontSize: 8, bold: true },
        {
          text: "Valor",
          margin: [1, 1],
          fontSize: 8,
          bold: true,
          alignment: "right",
        },
      ];

      let body = [];
      let bodyMoviment = [];
      let bodyMovimentWithDraw = [];
      let bodyResume = [];
      let bodyResumeFinal = [];

      let columnsBodyMoviment = [];
      let columnsBodyMovimentWithDraw = [];
      let columnsBody = [];
      let columnsBodyResume = [];
      let columnsBodyResumeFinal = [];

      columnsTitle.forEach((column) => columnsBody.push(column));
      body.push(columnsBody);

      columnsTitleMoviment.forEach((column) =>
        columnsBodyMoviment.push(column)
      );
      bodyMoviment.push(columnsBodyMoviment);

      columnsTitleMovimentWithDraw.forEach((column) =>
        columnsBodyMovimentWithDraw.push(column)
      );
      bodyMovimentWithDraw.push(columnsBodyMovimentWithDraw);

      columnsTitleResume.forEach((column) => columnsBodyResume.push(column));
      bodyResume.push(columnsBodyResume);

      columnsTitleResumeFinal.forEach((column) =>
        columnsBodyResumeFinal.push(column)
      );
      bodyResumeFinal.push(columnsBodyResumeFinal);

      await orders.forEach((order) => {
        const rows = [];
        rows.push({
          text: order.id,
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
        });
        rows.push({ text: order.client_name, margin: [1, 1], fontSize: 8 });
        rows.push({
          text: parseFloat(order.grand_total).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });
        rows.push({
          text: `${parseFloat(order.discount)}%`,
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });
        rows.push({
          text: parseFloat(order.total_to_pay).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          fontSize: 8,
          alignment: "right",
        });
        rows.push({
          text: moment(order.order_date).format("DD/MM/YYYY"),
          fontSize: 8,
          alignment: "center",
        });

        body.push(rows);
      });

      await revenues.forEach((rev) => {
        let rows = [];
        rows.push({
          text: rev.description,
          margin: [1, 1],
          fontSize: 8,
        });
        rows.push({
          text: moment(rev.due_date).format("DD/MM/YYYY"),
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
        });
        rows.push({
          text: parseFloat(rev.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });

        bodyMoviment.push(rows);
      });

      await expenses.forEach((rev) => {
        let rows = [];
        rows.push({
          text: rev.description,
          margin: [1, 1],
          fontSize: 8,
        });
        rows.push({
          text: moment(rev.due_date).format("DD/MM/YYYY"),
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
        });
        rows.push({
          text: parseFloat(rev.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });

        bodyMovimentWithDraw.push(rows);
      });

      await payments.forEach((pay) => {
        let rows = [];
        rows.push({ text: pay.identify, margin: [1, 1], fontSize: 8 });
        rows.push({
          text: moment(pay.due_date).format("DD/MM/YYYY"),
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
        });
        rows.push({
          text: parseFloat(pay.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });
        rows.push({
          text: pay.status === "paid_out" ? "Pago" : "Não pago",
          margin: [1, 1],
          fontSize: 8,
          alignment: "center",
        });

        bodyResume.push(rows);
      });

      await payFormsReport.forEach((pay) => {
        let rows = [];
        rows.push({ text: pay.pay_form, margin: [1, 1], fontSize: 8 });
        rows.push({
          text: parseFloat(pay.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          margin: [1, 1],
          fontSize: 8,
          alignment: "right",
        });

        bodyResumeFinal.push(rows);
      });

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
            text: "Relatório de Caixa",
            fontSize: 13,
            alignment: "center",
            margin: [0, 20, 0, 20],
            bold: true,
          },
          {
            text: `Colaborador: ${cashier.employee_name}`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: `Data de Abertura: ${moment(cashier.open_date).format(
              "DD/MM/YYYY"
            )}`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: `Valor de Abertura: ${parseFloat(
              cashier.open_value
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: `Data de Fechamento: ${
              !cashier.close_date
                ? "-"
                : moment(cashier.close_date).format("DD/MM/YYYY")
            }`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: `Valor de Fechamento: ${
              !cashier.close_value
                ? "-"
                : parseFloat(cashier.close_value).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
            }`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: `Status: ${cashier.status === "open" ? "Aberto" : "Fechado"}`,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: "Pedidos",
            fontSize: 11,
            alignment: "center",
            margin: [0, 7, 0, 7],
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [25, "*", 55, 45, 55, 50],

              body,
            },
          },
          {
            text: "Movimentação do Caixa: Depósitos",
            fontSize: 11,
            alignment: "center",
            margin: [0, 10, 0, 7],
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", 50, 50],

              body: bodyMoviment,
            },
          },
          {
            text: `Total dos Depósitos: ${parseFloat(
              valorRevenues
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`,
            fontSize: 11,
            alignment: "right",
            margin: [0, 10, 0, 7],
            bold: true,
          },
          {
            text: "Movimentação do Caixa: Retiradas",
            fontSize: 11,
            alignment: "center",
            margin: [0, 10, 0, 7],
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", 50, 50],

              body: bodyMovimentWithDraw,
            },
          },
          {
            text: `Total das Retiradas: ${parseFloat(
              valorExpenses
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`,
            fontSize: 11,
            alignment: "right",
            margin: [0, 10, 0, 7],
            bold: true,
          },
          {
            text: "Pagamentos",
            fontSize: 11,
            alignment: "center",
            margin: [0, 10, 0, 7],
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", 50, 50, 50],

              body: bodyResume,
            },
          },
          {
            text: "Resumo Financeiro",
            fontSize: 11,
            alignment: "center",
            margin: [0, 10, 0, 7],
            bold: true,
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ["*", "*"],

              body: bodyResumeFinal,
            },
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
      console.log(error);
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao gerar o relatório",
        errorMessage,
      });
    }
  },
};
