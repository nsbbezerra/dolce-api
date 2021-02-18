const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, description, department } = req.body;
    const { url } = req.file;
    try {
      await knex("categories").insert({
        name,
        departments_id: department,
        description,
        thumbnail: url,
      });
      return res.status(201).json({ message: "Cadastro efetuado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const categories = await knex.select("*").table("categories");
      return res.status(201).json(categories);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o departamento",
        errorMessage,
      });
    }
  },
};
