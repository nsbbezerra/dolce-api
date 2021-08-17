const knex = require("../../../database/pg");
const uniqid = require("uniqid");

module.exports = {
  async Open(req, res) {
    const { employee_id, open_value } = req.body;

    try {
      const date = new Date();
      await knex("cashier").insert({
        employee_id,
        open_value,
        open_date: date,
        status: "open",
        month: date.toLocaleString("pt-BR", { month: "long" }),
        year: date.getFullYear().toString(),
      });
      return res.status(201).json({ message: "Caixa aberto!" });
    } catch (error) {
      console.log(error);
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao abrir o caixa",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { find, init, final } = req.params;

    try {
      const date = new Date();

      if (find === "1") {
        const cashier = await knex
          .select([
            "cashier.id",
            "cashier.open_value",
            "cashier.status",
            "cashier.close_value",
            "cashier.open_date",
            "cashier.close_date",
            "employees.id as employee_id",
            "employees.name as employee_name",
          ])
          .from("cashier")
          .where({
            month: date.toLocaleString("pt-BR", { month: "long" }),
            year: date.getFullYear().toString(),
          })
          .innerJoin("employees", "employees.id", "cashier.employee_id")
          .orderBy("cashier.open_date", "desc");
        return res.status(201).json(cashier);
      }

      if (find === "2") {
        const cashier = await knex
          .select([
            "cashier.id",
            "cashier.open_value",
            "cashier.status",
            "cashier.close_value",
            "cashier.open_date",
            "cashier.close_date",
            "employees.id as employee_id",
            "employees.name as employee_name",
          ])
          .from("cashier")
          .where({
            month: init,
            year: final,
          })
          .innerJoin("employees", "employees.id", "cashier.employee_id")
          .orderBy("cashier.open_date", "desc");
        return res.status(201).json(cashier);
      }

      if (find === "3") {
        const cashier = await knex
          .select([
            "cashier.id",
            "cashier.open_value",
            "cashier.status",
            "cashier.close_value",
            "cashier.open_date",
            "cashier.close_date",
            "employees.id as employee_id",
            "employees.name as employee_name",
          ])
          .from("cashier")
          .whereBetween("open_date", [new Date(init), new Date(final)])
          .innerJoin("employees", "employees.id", "cashier.employee_id")
          .orderBy("cashier.open_date", "desc");
        return res.status(201).json(cashier);
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro",
        errorMessage,
      });
    }
  },

  async FindOrders(req, res) {
    const { page } = req.params;
    const pageInt = parseInt(page);

    try {
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
        .where({ status_order_shop: "billed" })
        .innerJoin("clients", "clients.id", "orders.client_id")
        .orderBy("orders.order_date", "desc")
        .limit(10)
        .offset((pageInt - 1) * 10);

      const [count] = await knex("orders")
        .where({ status_order_shop: "billed" })
        .count();

      return res.status(201).json({ orders, count });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro",
        errorMessage,
      });
    }
  },

  async FinishOrder(req, res) {
    const { order } = req.params;
    const { cash } = req.body;

    try {
      await knex("orders")
        .where({ id: order })
        .update({ status_order_shop: "completed", cashier_id: cash });
      await knex("payments")
        .where({ order_id: order })
        .update({ cashier_id: cash });
      return res.status(201).json({ message: "Pedido finalizado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro",
        errorMessage,
      });
    }
  },

  async Moviment(req, res) {
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

      return res.status(201).json({
        orders,
        payments,
        revenues,
        expenses,
        cashier,
        payFormsReport,
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro",
        errorMessage,
      });
    }
  },

  async CloseCashier(req, res) {
    const { cash } = req.params;

    try {
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
      let soma = valorRevenues - valorExpenses;
      await knex("cashier")
        .where({ id: cash })
        .update({ status: "close", close_date: new Date(), close_value: soma });
      return res.status(201).json({ message: "Caixa fechado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro",
        errorMessage,
      });
    }
  },
};
