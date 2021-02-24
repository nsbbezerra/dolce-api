const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { product, description, list } = req.body;
    try {
      await knex("details").insert({
        products_id: product,
        description,
        list: JSON.stringify(list),
      });
      return res
        .status(201)
        .json({ message: "Detalhes inseridos com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar os detalhes",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { product } = req.params;
    try {
      const details = await knex("details")
        .where({ products_id: product })
        .select("*");
      return res.status(200).json(details);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os detalhes",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { description, list } = req.body;
    const { id } = req.params;

    try {
      await knex("details")
        .where({ id: id })
        .update({
          description,
          list: JSON.stringify(list),
        });
      return res.status(200).json({ message: "Detalhe editado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os detalhes",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;
    try {
      await knex("details").where({ id: id }).del();
      return res.status(200).json({ message: "Detalhe excluído com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os detalhes",
        errorMessage,
      });
    }
  },
};
