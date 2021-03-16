const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      client_id,
      number,
      entity,
      situation,
      status,
      value,
      emission,
      due_date,
      observation,
    } = req.body;
    try {
      await knex("checks").insert({
        client_id,
        number,
        entity,
        situation,
        status,
        value,
        emission,
        due_date,
        observation,
      });
      return res.status(201).json({ message: "Cadastro efetuado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o cheque",
        errorMessage,
      });
    }
  },

  async Status(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const cheks = await knex("checks")
        .where({ id: id })
        .update({ status })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação atualizada com sucesso", cheks });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao atualizar as informações",
        errorMessage,
      });
    }
  },

  async Situation(req, res) {
    const { id } = req.params;
    const { situation } = req.body;
    try {
      const cheks = await knex("checks")
        .where({ id: id })
        .update({ situation })
        .returning("*");
      return res
        .status(201)
        .json({ message: "Informação atualizada com sucesso", cheks });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao atualizar as informações",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const checks = await knex
        .select([
          "checks.id",
          "checks.number",
          "checks.entity",
          "checks.situation",
          "checks.status",
          "checks.value",
          "checks.emission",
          "checks.due_date",
          "clients.id as id_client",
          "clients.name as name_client",
        ])
        .from("checks")
        .innerJoin("clients", "clients.id", "checks.client_id");
      return res.status(201).json(checks);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;
    try {
      await knex("checks").where({ id: id }).del();
      return res.status(201).json({ message: "Cheque removido com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir as informações",
        errorMessage,
      });
    }
  },
};
