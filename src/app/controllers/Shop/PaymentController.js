const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { order_id, payments, employee_id, client_id } = req.body;

    try {
      const payForms = await knex.select("*").from("payForm");
      const planAccounts = await knex
        .select("*")
        .from("planAccounts")
        .where({ name: "Venda De Produtos" })
        .first();
      const bankAccounts = await knex.select("*").from("bankAccount");
      const cashier = await knex.select("id").from("cashier").first();
      const client = await knex
        .select("*")
        .from("clients")
        .where({ id: client_id })
        .first();
      const employee = await knex
        .select("*")
        .from("employees")
        .where({ id: employee_id })
        .first();

      async function setPayment(value) {
        function addDays(date, days) {
          let data = new Date(date);
          data.setDate(data.getDate() + days);
          return {
            data: data,
            month: data.toLocaleString("pt-BR", { month: "long" }),
            year: data.getFullYear().toString(),
          };
        }
        const payForm = await payForms.find(
          (obj) => obj.id === value.pay_form_id
        );
        const bank = await bankAccounts.find(
          (obj) => obj.id === payForm.bank_id
        );
        if (value.pay_form_status === "parceled_out") {
          for (let index = 0; index < value.installment_amount; index++) {
            const ind = index + 1;
            const interval = payForm.interval_days * ind;
            await knex("payments").insert({
              order_id: order_id,
              cashier_id: cashier.id,
              payForm_id: payForm.id,
              planAccounts_id: planAccounts.id,
              identify: `Pagamento referente ao pedido nº: ${order_id}, do cliente: ${client.name} - ${payForm.name} - ${ind}/${value.installment_amount}`,
              value: value.installment_value,
              date_mov: new Date(),
              due_date: addDays(new Date(), interval).data,
              month: addDays(new Date(), interval).month,
              year: addDays(new Date(), interval).year,
              status: "waiting",
              client_id: client_id,
            });
          }
        } else {
          const date = new Date();
          await knex("payments").insert({
            order_id: order_id,
            cashier_id: cashier.id,
            payForm_id: payForm.id,
            planAccounts_id: planAccounts.id,
            identify: `Pagamento referente ao pedido nº: ${order_id}, do cliente: ${client.name} - ${payForm.name}`,
            value: value.installment_value,
            date_mov: date,
            due_date: date,
            month: date.toLocaleString("pt-BR", { month: "long" }),
            year: date.getFullYear().toString(),
            status: "paid_out",
            client_id: client_id,
          });
          let actualyAmount = bank ? parseFloat(bank.amount) : 0;
          await knex("bankAccount")
            .where({ id: bank.id })
            .update({ amount: actualyAmount + value.installment_value });

          if (JSON.stringify(employee) !== "{}") {
            let comission = parseFloat(employee.comission);
            let calc = (value.installment_value * comission) / 100;
            if (employee.comissioned) {
              await knex("commission").insert({
                employee_id: employee_id,
                order_id: order_id,
                value: calc,
                month: date.toLocaleString("pt-BR", { month: "long" }),
                year: date.getFullYear().toString(),
              });
            }
          }
        }
      }

      await payments.forEach((pay) => {
        setPayment(pay);
      });

      await knex("orders")
        .where({ id: order_id })
        .update({ payment_info: JSON.stringify(payments) });

      const findPaymentOrder = await payments.filter(
        (obj) => obj.pay_form_status === "parceled_out"
      );

      if (findPaymentOrder.length === 0) {
        await knex("orders")
          .where({ id: order_id })
          .update({ waiting: "none" });
      } else {
        await knex("orders").where({ id: order_id }).update({ waiting: "yes" });
      }

      return res
        .status(201)
        .json({ message: "Pagamentos inseridos com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o pix",
        errorMessage,
      });
    }
  },

  async FindPaymentsByOrders(req, res) {
    const { order } = req.params;

    try {
      const payments = await knex
        .select("*")
        .from("payments")
        .where({ order_id: order })
        .orderBy("due_date");

      return res.status(201).json(payments);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o pix",
        errorMessage,
      });
    }
  },

  async DelPaymentsByOrder(req, res) {
    const { order } = req.params;

    try {
      await knex("payments").where({ order_id: order }).del();
      await knex("commission").where({ order_id: order }).del();
      return res
        .status(201)
        .json({ message: "Pagamentos cancelados com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o pix",
        errorMessage,
      });
    }
  },
};
