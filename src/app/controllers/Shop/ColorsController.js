const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { product, name, hex } = req.body;

    try {
      await knex("colors").insert({
        products_id: product,
        name,
        hex,
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
      const colors = await knex.select("*").table("colors");
      return res.status(201).json(colors);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },
};
