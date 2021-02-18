const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { product, color, size, amount } = req.body;

    try {
      await knex("sizes").insert({
        products_id: product,
        colors_id: color,
        size,
        amount,
      });
      return res.status(201).json({ message: "Cadastro efetuado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao efetuar o cadastro",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const sizes = await knex.select("*").table("sizes");
      return res.status(201).json(sizes);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
