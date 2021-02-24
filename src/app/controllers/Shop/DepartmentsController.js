const configs = require("../../../configs/configs");
const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, description } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobDepartments}${blobName}`;
    try {
      await knex("departments").insert({
        name,
        description,
        thumbnail: url,
      });
      return res
        .status(201)
        .json({ message: "Departamento cadastrado com sucesso" });
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
      const departments = await knex.select("*").table("departments");
      return res.status(201).json(departments);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os departamentos",
        errorMessage,
      });
    }
  },
};
