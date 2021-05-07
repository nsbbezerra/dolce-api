const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      bank,
      mode,
      agency,
      account,
      variation,
      operation,
      amount,
    } = req.body;

    try {
      await knex("bankAccount").insert({
        bank,
        mode,
        agency,
        account,
        variation,
        operation,
        amount,
      });
      return res
        .status(201)
        .json({ message: "Conta bancária cadastrada com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar a conta bancária",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const banks = await knex.select("*").from("bankAccount");
      return res.status(200).json(banks);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao listar as contas bancárias",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const {
      bank,
      mode,
      agency,
      account,
      variation,
      operation,
      amount,
    } = req.body;
    const { id } = req.params;

    try {
      const banks = await knex("bankAccount")
        .where({ id: id })
        .update({ bank, mode, agency, account, variation, operation, amount })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Conta bancária alterada com sucesso", banks });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar a conta bancária",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const bank = await knex("bankAccount")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Conta bancária alterada com sucesso", bank });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao bloquear/ativar a conta bancária",
        errorMessage,
      });
    }
  },
};
