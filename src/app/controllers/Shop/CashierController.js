const knex = require("../../../database/pg");

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
        message: "Ocorreu um erro ao listar os caixas",
        errorMessage,
      });
    }
  },
};
