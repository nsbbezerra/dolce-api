const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      name,
      bank_id,
      type,
      max_portion,
      interval_days,
      status,
      show_on_site,
    } = req.body;

    try {
      await knex("payForm").insert({
        name,
        bank_id,
        type,
        max_portion,
        interval_days,
        status,
        show_on_site,
      });
      return res
        .status(201)
        .json({ message: "Forma de pagamento cadastrada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a forma de pagamento",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const payForms = await knex
        .select([
          "payForm.id",
          "payForm.name",
          "payForm.max_portion",
          "payForm.interval_days",
          "payForm.status",
          "payForm.type",
          "payForm.show_on_site",
          "bankAccount.id as id_bank_account",
          "bankAccount.bank",
        ])
        .from("payForm")
        .innerJoin("bankAccount", "bankAccount.id", "payForm.bank_id");
      const banks = await knex.select("id", "bank").from("bankAccount");
      return res.status(200).json({ payForms, banks });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as formas de pagamento",
        errorMessage,
      });
    }
  },

  async ShowPdv(req, res) {
    try {
      const payForms = await knex
        .select([
          "payForm.id",
          "payForm.name",
          "payForm.max_portion",
          "payForm.interval_days",
          "payForm.status",
          "payForm.type",
          "payForm.show_on_site",
          "bankAccount.id as id_bank_account",
          "bankAccount.bank",
        ])
        .from("payForm")
        .innerJoin("bankAccount", "bankAccount.id", "payForm.bank_id");
      return res.status(200).json(payForms);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as formas de pagamento",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { name, bank_id, type, max_portion, interval_days, status } =
      req.body;
    const { id } = req.params;

    try {
      const payForms = await knex("payForm")
        .where({ id: id })
        .update({
          name,
          bank_id,
          type,
          max_portion,
          interval_days,
          status,
        })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", payForms });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar a forma de pagamento",
        errorMessage,
      });
    }
  },

  async ShowOnSite(req, res) {
    const { id } = req.params;
    const { show_on_site } = req.body;
    try {
      const payForms = await knex("payForm")
        .where({ id: id })
        .update({ show_on_site })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", payForms });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar a forma de pagamento",
        errorMessage,
      });
    }
  },
};
