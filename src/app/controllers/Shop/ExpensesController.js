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
    const { find } = req.params;

    try {
      s;
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
