const knex = require("../../../database/pg");
const configs = require("../../../configs/configs");

module.exports = {
  async Store(req, res) {
    const {
      name,
      cnpj,
      contact,
      email,
      street,
      number,
      comp,
      district,
      city,
      cep,
      state,
    } = req.body;
    const { blobName } = req.file;
    const url = `${configs.blobProvider}${blobName}`;
    try {
      await knex("providers").insert({
        name,
        cnpj,
        contact,
        email,
        street,
        number,
        comp,
        district,
        city,
        cep,
        state,
        thumbnail: url,
      });
      return res
        .status(201)
        .json({ message: "Fornecedor cadastrado com sucesso" });
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao cadastrar o fornecedor",
        errorMessage,
      });
    }
  },

  async Show(req, res) {
    try {
      const providers = await knex.select("*").from("providers");
      return res.status(201).json(providers);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao buscar os fornecedores",
        errorMessage,
      });
    }
  },
};
