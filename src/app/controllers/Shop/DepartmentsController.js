const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const { name, description } = req.body;
    const { url } = req.file;
    console.log("FILENAME", req.file);
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
};
