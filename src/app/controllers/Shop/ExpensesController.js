const knex = require("../../../database/pg");

module.exports = {
  async Dependents(req, res) {
    try {
      const payForm = await knex.select("*").from("payForm").orderBy("name");
      const planAccounts = await knex
        .select("*")
        .from("planAccounts")
        .where({ mode: "debit" })
        .orderBy("name");
      return res.status(200).json({ payForm, planAccounts });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
  async Store(req, res) {
    const {
      payForm_id,
      planAccounts_id,
      identify,
      due_date,
      value,
      status,
      movimentation,
      description,
    } = req.body;
    try {
      const date = new Date(due_date);

      await knex("expenses").insert({
        payForm_id,
        planAccounts_id,
        identify,
        due_date,
        value,
        status,
        movimentation,
        description,
        month: date.toLocaleString("pt-BR", { month: "long" }),
        year: date.getFullYear().toString(),
      });
      return res
        .status(201)
        .json({ message: "Despesa cadastrada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a despesa",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { find, init, final } = req.params;

    try {
      const date = new Date();

      if (find === "1") {
        const expenses = await knex
          .select([
            "expenses.id",
            "expenses.identify",
            "expenses.month",
            "expenses.year",
            "expenses.movimentation",
            "expenses.status",
            "expenses.value",
            "expenses.description",
            "expenses.due_date",
            "payForm.name as pay_form_name",
            "payForm.id as pay_form_id",
            "planAccounts.id as plan_accounts_id",
            "planAccounts.name as plan_accounts_name",
          ])
          .from("expenses")
          .where({
            month: date.toLocaleString("pt-BR", { month: "long" }),
            year: date.getFullYear().toString(),
          })
          .innerJoin("payForm", "payForm.id", "expenses.payForm_id")
          .innerJoin(
            "planAccounts",
            "planAccounts.id",
            "expenses.planAccounts_id"
          )
          .orderBy("expenses.due_date");

        return res.status(200).json(expenses);
      }
      if (find === "2") {
        const expenses = await knex
          .select([
            "expenses.id",
            "expenses.identify",
            "expenses.month",
            "expenses.year",
            "expenses.movimentation",
            "expenses.status",
            "expenses.value",
            "expenses.description",
            "expenses.due_date",
            "payForm.name as pay_form_name",
            "payForm.id as pay_form_id",
            "planAccounts.id as plan_accounts_id",
            "planAccounts.name as plan_accounts_name",
          ])
          .from("expenses")
          .where({
            month: init,
            year: final,
          })
          .innerJoin("payForm", "payForm.id", "expenses.payForm_id")
          .innerJoin(
            "planAccounts",
            "planAccounts.id",
            "expenses.planAccounts_id"
          )
          .orderBy("expenses.due_date");

        return res.status(200).json(expenses);
      }
      if (find === "3") {
        const expenses = await knex
          .select([
            "expenses.id",
            "expenses.identify",
            "expenses.month",
            "expenses.year",
            "expenses.movimentation",
            "expenses.status",
            "expenses.value",
            "expenses.description",
            "expenses.due_date",
            "payForm.name as pay_form_name",
            "payForm.id as pay_form_id",
            "planAccounts.id as plan_accounts_id",
            "planAccounts.name as plan_accounts_name",
          ])
          .from("expenses")
          .whereBetween("due_date", [new Date(init), new Date(final)])
          .innerJoin("payForm", "payForm.id", "expenses.payForm_id")
          .innerJoin(
            "planAccounts",
            "planAccounts.id",
            "expenses.planAccounts_id"
          )
          .orderBy("expenses.due_date");

        return res.status(200).json(expenses);
      }
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async UpdateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const expense = await knex("expenses")
        .where({ id: id })
        .update({ status })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso", expense });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async UpdateMovimentation(req, res) {
    const { id } = req.params;
    const { movimentation } = req.body;

    try {
      const expense = await knex("expenses")
        .where({ id: id })
        .update({ movimentation })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso", expense });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async UpdateInfo(req, res) {
    const { id } = req.params;
    const {
      payForm_id,
      planAccounts_id,
      identify,
      due_date,
      value,
      description,
    } = req.body;

    try {
      const date = new Date(due_date);
      const expense = await knex("expenses")
        .where({ id: id })
        .update({
          payForm_id,
          planAccounts_id,
          identify,
          due_date,
          value,
          description,
          month: date.toLocaleString("pt-BR", { month: "long" }),
          year: date.getFullYear().toString(),
        })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso", expense });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao alterar as informações",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;

    try {
      await knex("expenses").where({ id: id }).del();

      return res.status(201).json({ message: "Despesa excluída com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir a despesa",
        errorMessage,
      });
    }
  },
};
