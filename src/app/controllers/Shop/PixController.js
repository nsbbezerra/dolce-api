const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { type, value } = req.body;
    try {
      await knex("pix").insert({ type, value });
      return res.status(201).json({ message: "PIX salvo com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao salvar o pix",
        errorMessage,
      });
    }
  },
  async Remove(req, res) {
    const { id } = req.params;

    try {
      await knex("pix").where({ id: id }).del();
      return res.status(201).json({ message: "PIX excluído com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao excluir o pix",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const pix = await knex.select("*").from("pix").orderBy("value");
      return res.status(200).json(pix);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os pixs",
        errorMessage,
      });
    }
  },
};
