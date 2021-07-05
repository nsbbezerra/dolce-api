const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { product, size, amount } = req.body;

    try {
      await knex("sizes").insert({
        products_id: product,
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

  async Find(req, res) {
    const { color } = req.params;
    try {
      const sizes = await knex
        .select("*")
        .from("colors")
        .join("sizes", function () {
          this.on("colors.id", "=", "sizes.colors_id").onIn(
            "sizes.products_id",
            color
          );
        })
        .orderBy("size");
      return res.status(201).json(sizes);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async FindByProducts(req, res) {
    const { product } = req.params;
    try {
      const sizes = await knex
        .select("*")
        .from("sizes")
        .whereExists(function () {
          this.select("id").from("sizes").whereRaw(`products_id = ${product}`);
        });
      return res.status(200).json(sizes);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar as informações",
        errorMessage,
      });
    }
  },

  async Update(req, res) {
    const { size, amount } = req.body;
    const { id } = req.params;
    try {
      await knex("sizes").where({ id: id }).update({ size, amount });
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso" });
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
      await knex("sizes").where({ id: id }).del();
      return res.status(201).json({ message: "Excluído com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar as informações",
        errorMessage,
      });
    }
  },

  async FindDependents(req, res) {
    const { product } = req.params;
    try {
      const colors = await knex("colors")
        .select("*")
        .where({ products_id: product });
      return res.status(201).json(colors);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao editar as informações",
        errorMessage,
      });
    }
  },
};
