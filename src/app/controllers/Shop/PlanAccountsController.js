const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { plan, name, mode } = req.body;
    try {
      const plans = await knex("planAccounts").where({ plan: plan }).first();
      if (plans) {
        return res
          .status(400)
          .json({ message: "Plano de contas já cadastrado" });
      }
      await knex("planAccounts").insert({ plan, name, mode });
      return res
        .status(201)
        .json({ message: "Plano de Contas cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao salvar o plano de contas",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const plan = await knex.select("*").from("planAccounts");
      return res.status(200).json(plan);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os planos de conta",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { plan, name, mode } = req.body;
    const { id } = req.params;

    try {
      const find = await knex("planAccounts").where({ plan: plan }).first();
      if (find) {
        return res
          .status(400)
          .json({ message: "Plano de contas já cadastrado" });
      }
      const plans = await knex("planAccounts")
        .where({ id: id })
        .update({ plan, name, mode })
        .returning("*");
      return res
        .status(200)
        .json({ message: "Plano de contas alterado com sucesso", plans });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar o plano de conta",
        errorMessage,
      });
    }
  },

  async Active(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      const plans = await knex("planAccounts")
        .where({ id: id })
        .update({ active })
        .returning("*");
      return res.status(200).json({
        message: "Plano de conta ativado/bloqueado com sucesso",
        plans,
      });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao ativa/bloquear o plano de conta",
        errorMessage,
      });
    }
  },
};
