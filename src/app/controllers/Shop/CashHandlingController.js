const knex = require("../../../database/pg");
const uniqid = require("uniqid");

module.exports = {
  async Handling(req, res) {
    const { description, value, cashier_id, type } = req.body;
    try {
      await knex("cashierMov").insert({
        description,
        value,
        cashier_id,
        type,
        identify: uniqid(),
      });

      return res
        .status(201)
        .json({ message: "Movimentação inserida com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao inserir movimentações",
        errorMessage,
      });
    }
  },
};
