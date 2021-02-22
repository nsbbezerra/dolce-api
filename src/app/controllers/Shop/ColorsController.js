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
      const colors = await knex("colors")
        .where({ products_id: product })
        .select("name", "hex");
      return res
        .status(201)
        .json({ message: "Cadastro efetuado com sucesso", colors });
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

  async Update(req, res) {
    const { product, name, hex } = req.body;
    const { id } = req.params;
    try {
      await knex("colors").where({ id: id }).update({ name, hex });
      const colors = await knex("colors")
        .where({ products_id: product })
        .select("name", "hex");

      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso", colors });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar as informações",
        errorMessage,
      });
    }
  },

  async Remove(req, res) {
    const { id } = req.params;
    try {
      await knex("colors").where({ id: id }).del();
      return res.status(200).json({ message: "Cor removida com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao remover as informações",
        errorMessage,
      });
    }
  },

  async Find(req, res) {
    const { id } = req.params;

    try {
      const colors = await knex("colors")
        .where({ products_id: id })
        .select("name", "hex", "id");
      return res.status(201).json(colors);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao remover as informações",
        errorMessage,
      });
    }
  },

  async FindProducts(req, res) {
    try {
      const products = await knex.select("id", "name").table("products");
      return res.status(201).json(products);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao remover as informações",
        errorMessage,
      });
    }
  },
};
